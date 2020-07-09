import React from 'react';
import withStyles from 'react-jss';

import backend from '../../tools/backend';
import axios from 'axios';
import Loading from '../utils/Loading';
import Retry from '../utils/Retry';

import AppContext from './AppContext';
import MazeErrorVector from '../../vectors/maze-loading-error.svg';
import ApiCache from '../../tools/ApiCache';
import errorReporter from '../../tools/errorReporter';

const styles = {
	LoadingContainer: { height: '100vh' }
};

class AppProvider extends React.Component {
	constructor(props) {
		super(props);

		this.updateState = this.updateState.bind(this);
		this.getDate = this.getDate.bind(this);
		this.updateDateOffset = this.updateDateOffset.bind(this);

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

	async updateDateOffset() {
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

		this.setState({ dateOffset });
	}

	async updateState(silent = false) {
		if (!silent) {
			this.setState({ status: 'loading' });
		}

		try {
			const getState = await backend.get('/api/state', {
				cancelToken: this.cancelTokenSource.token
			});
			const payload = getState.data.payload;

			await this.updateDateOffset();

			this.setState({ status: 'loaded', ...payload });

			await ApiCache.delete('/api/state');
			await ApiCache.create('/api/state', payload, this.getDate());
		} catch (e) {
			this.setState({ status: 'error' });

			if (window.navigator.onLine) {
				errorReporter.notify(e, {
					url: window.location.href,
					context: {
						userContext: this.context
					},
					action: 'setting up state'
				});
			}
		}
	}

	componentDidMount() {
		ApiCache.findOne('/api/state')
			.then(async entry => {
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
						await ApiCache.delete('/api/state');
					}
				}
			})
			.finally(async () => {
				await this.updateState(true);
			});
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
