import React from 'react';
import withStyles from 'react-jss';

import backend from '../../tools/backend';
import axios from 'axios';
import Loading from '../utils/Loading';
import Retry from '../utils/Retry';

import AppContext from './AppContext';
import MazeErrorVector from '../../vectors/maze-loading-error.svg';
import apiCache from '../../tools/apiCache';

const styles = {
	LoadingContainer: { height: '100vh' }
};

class AppProvider extends React.Component {
	constructor(props) {
		super(props);

		this.updateState = this.updateState.bind(this);
		this.getDate = this.getDate.bind(this);

		this.state = {
			signedIn: false,
			user: {},
			admin: {},
			campaignManager: {},
			dateOffset: 0,
			updateState: this.updateState,
			getDate: this.getDate,
			status: 'loaded'
		};

		this.cancelTokenSource = axios.CancelToken.source();
	}

	getDate() {
		const localTimestamp = new Date().getTime();

		return new Date(localTimestamp + this.state.dateOffset);
	}

	async updateState(silent = false) {
		if (!silent) {
			this.setState({ status: 'loading' });
		}

		try {
			// The reason we make two requests is because the server might be sleeping
			// That would then result in inaccurate request duration calculations
			// The first /api/state request would wake up the server
			// Then the server is already awake when we get /api/date

			const getState = await backend.get('/api/state', {
				cancelToken: this.cancelTokenSource.token
			});
			const payload = getState.data.payload;

			const requestStartTime = new Date();
			const getDate = await backend.get('/api/date', {
				cancelToken: this.cancelTokenSource.token
			});
			const serverDateString = getDate.data.payload.date;

			const now = new Date();
			const requestDuration = now.getTime() - requestStartTime.getTime();
			const serverStartTime = new Date(serverDateString);

			const serverTime = new Date(
				serverStartTime.getTime() + requestDuration
			);

			const dateOffset = serverTime.getTime() - now.getTime();

			this.setState({ status: 'loaded', dateOffset, ...payload });

			await apiCache.requests.where({ url: '/api/state' }).delete();

			await apiCache.requests.add({
				url: '/api/state',
				data: payload,
				date: this.getDate()
			});
		} catch (e) {
			this.setState({ status: 'error' });
		}
	}

	componentDidMount() {
		apiCache.requests
			.where({ url: '/api/state' })
			.first(entry => {
				if (entry) {
					const now = this.getDate();
					const maxAge = 1000 * 86400 * 7;
					const difference = now.getTime() - entry.date.getTime();

					const expiration = new Date(entry.data?.expires);

					const isValid = !entry.data?.signedIn || expiration > now;

					if (difference < maxAge && isValid) {
						this.setState({
							...entry.data,
							status: 'loaded'
						});
					} else {
						apiCache.requests.where({ url: '/api/state' }).delete();
					}
				}
			})
			.finally(async () => {
				await this.updateState(true);
			});
	}

	componentWillUnmount() {
		this.cancelTokenSource.cancel('Component will unmount');
	}

	render() {
		if (this.state.status !== 'loaded') {
			return (
				<div className={this.props.classes.LoadingContainer}>
					{this.state.status === 'loading' && <Loading />}

					{this.state.status === 'error' && (
						<Retry
							onRetry={() => this.setState({ status: 'loaded' })}
							message={`Couldn't get latest information from the server.`}
							image={MazeErrorVector}
							buttonText={'Continue Offline'}
						/>
					)}
				</div>
			);
		}

		return (
			<AppContext.Provider value={this.state}>
				{this.props.children}
			</AppContext.Provider>
		);
	}
}

export default withStyles(styles)(AppProvider);
