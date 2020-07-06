import React from 'react';
import AdminElectionContext from './AdminElectionContext';
import backend from '../../../tools/backend';
import ElectionDataForm from './ElectionDataForm';
import MessageQueue from '../../queues/MessageQueue';
import { Redirect } from 'react-router-dom';
import Title from '../../../typography/Title';
import BackButton from '../../utils/BackButton';

class EditElection extends React.Component {
	static contextType = AdminElectionContext;

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

	formatDate(date) {
		const year = 1900 + date.getYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	formatTime(date) {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${hours}:${minutes}`;
	}

	componentDidMount() {
		const contextCopy = JSON.parse(JSON.stringify(this.context));

		const start = new Date(contextCopy.startTime);
		const end = new Date(contextCopy.endTime);

		contextCopy.startDate = this.formatDate(start);
		contextCopy.startTime = this.formatTime(start);

		contextCopy.endDate = this.formatDate(end);
		contextCopy.endTime = this.formatTime(end);

		contextCopy.grades = contextCopy.allowedGrades;
		this.setState(contextCopy);
	}

	checkPublicUrl() {
		const isOriginalValue = this.state.publicUrl === this.context.publicUrl;

		if (this.state.publicUrl && !isOriginalValue) {
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
		} else if (isOriginalValue) {
			this.setState({ publicUrlIcon: 'done' });
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
			.post(`/api/admin/elections/${this.context.publicUrl}/edit`, {
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
					this.context.reload();
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
			return <Redirect to={`/admin/elections/${this.state.publicUrl}`} />;
		}

		return (
			<div>
				<BackButton
					text={`Manage ${this.context.name}`}
					to={`/admin/elections/${this.context.publicUrl}`}
				/>
				<Title level={2} center>
					Edit Election:{' '}
					<span style={{ color: '#16a085' }}>{this.state.name}</span>
				</Title>
				<ElectionDataForm {...this.state} />
			</div>
		);
	}
}

export default EditElection;
