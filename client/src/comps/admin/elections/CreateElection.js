import React from 'react';
import Title from '../../../typography/Title';
import BackButton from '../../utils/BackButton';
import ElectionDataForm from './ElectionDataForm';
import withStyles from 'react-jss';
import backend from '../../../tools/backend';
import MessageQueue from '../../queues/MessageQueue';
import { Redirect } from 'react-router-dom';

const styles = {
	PageContainer: {
		paddingBottom: '5rem'
	}
};

class CreateElection extends React.Component {
	constructor(props) {
		super(props);

		this.setFormValue = (name, value) => {
			this.setState({ [name]: value });
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.checkPublicUrl = this.checkPublicUrl.bind(this);

		this.state = {
			name: '',
			type: '',
			startDate: '',
			startTime: '',
			endDate: '',
			endTime: '',
			publicUrl: '',
			publicUrlIcon: '',
			grades: [],
			picture: '',
			visible: true,
			success: false,
			setFormValue: this.setFormValue,
			onSubmit: this.onSubmit,
			checkPublicUrl: this.checkPublicUrl
		};
	}

	checkPublicUrl() {
		if (this.state.publicUrl) {
			// Set the trailingIcon to a loading icon while we check the avilability
			this.setState({ publicUrlIcon: 'autorenew' });
			backend
				.get(`/api/admin/elections/${this.state.publicUrl}`)
				.then(res => {
					if (res.data.payload) {
						this.setState({ publicUrlIcon: 'error_outline' });
					}
				})
				.catch(er => {
					if (
						er.response &&
						er.response.data.error.code === 'NOT_FOUND'
					) {
						this.setState({ publicUrlIcon: 'done' });
					} else {
						this.setState({ publicUrlIcon: 'error_outline' });
					}
				});
		}
	}

	onSubmit() {
		const {
			name,
			type,
			startDate,
			startTime,
			endDate,
			endTime,
			publicUrl,
			grades,
			picture,
			visible
		} = this.state;

		const start = new Date(`${startDate}T${startTime}`);
		const end = new Date(`${endDate}T${endTime}`);

		const formattedStartTime = start.toISOString();
		const formattedEndTime = end.toISOString();

		backend
			.post('/api/admin/elections/create', {
				name,
				type,
				publicUrl,
				picture,
				grades,
				visible,
				startTime: formattedStartTime,
				endTime: formattedEndTime
			})
			.then(res => {
				if (res.data.success) {
					this.setState({ success: true });
				}
			})
			.catch(er => {
				MessageQueue.notify({
					body: er?.response?.data?.error?.message || 'Network Error',
					actions: [{ icon: 'close' }]
				});
			});
	}

	render() {
		if (this.state.success) {
			return <Redirect to={`/elections/${this.state.publicUrl}`} />;
		}

		return (
			<div className={JSON.stringify(this.props.classes.PageContainer)}>
				<BackButton text={'Manage Elections'} to={'/admin/elections'} />

				<Title level={2} center>
					Create Election
				</Title>

				<ElectionDataForm {...this.state} />
			</div>
		);
	}
}

export default withStyles(styles)(CreateElection);
