import React from 'react';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Select } from '@rmwc/select';
import Text from '../../../typography/Text';
import { Switch } from '@rmwc/switch';
import Title from '../../../typography/Title';
import urlJoin from 'url-join';
import { API_URL } from '../../../constants';
import ElectionPicDialog from './ElectionPicDialog';
import { Button } from '@rmwc/button';
import { createUseStyles } from 'react-jss';
import MessageQueue from '../../queues/MessageQueue';

import { Checkbox } from '@rmwc/checkbox';
import '@rmwc/checkbox/styles';

import '@rmwc/textfield/styles';
import '@rmwc/select/select.css';
import '@material/select/dist/mdc.select.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';
import '@material/menu-surface/dist/mdc.menu-surface.css';
import '@rmwc/switch/styles';

const useStyles = createUseStyles({
	PageContainer: {
		paddingBottom: '5rem'
	},
	FullWidthInput: {
		width: '100%'
	},
	SelectedImage: {
		marginBottom: '1rem',
		borderRadius: '5px'
	},
	SubmitButton: {
		marginTop: '2rem',
		color: 'white !important'
	},
	FormContainer: {
		width: '100%',
		maxWidth: '65rem'
	}
});

const electionTypes = [
	{
		label: 'Instant Runoff Election',
		value: 'runoff'
	},
	{
		label: 'Plurality (most votes)',
		value: 'plurality'
	}
];

const allGrades = [9, 10, 11, 12];

const ElectionDataForm = ({
	name,
	type,
	startDate,
	startTime,
	endDate,
	endTime,
	publicUrl,
	publicUrlIcon,
	picture,
	grades,
	visible,
	checkPublicUrl,
	setFormValue,
	onSubmit
}) => {
	const classes = useStyles();

	const defaultOnChangeHandler = ev => {
		const input = ev.target;
		setFormValue(input.name, input.value);
	};

	const preSubmitCheck = () => {
		if (!name) {
			MessageQueue.notify({
				body: 'You need to give this election a name!',
				actions: [{ icon: 'close' }]
			});
			return false;
		}

		if (!publicUrl) {
			MessageQueue.notify({
				body: 'You need to give this election a url!',
				actions: [{ icon: 'close' }]
			});
			return false;
		}

		if (!electionTypes.some(option => option.value === type)) {
			MessageQueue.notify({
				body: 'You need to select a valid election type!',
				actions: [{ icon: 'close' }]
			});
			return false;
		}

		if (!picture) {
			MessageQueue.notify({
				body: 'You need to select a picture for this election!',
				actions: [{ icon: 'close' }]
			});
			return false;
		}

		try {
			new Date(`${startDate}T${startTime}`).toISOString();
			new Date(`${endDate}T${endTime}`).toISOString();
		} catch (e) {
			MessageQueue.notify({
				body: 'You need to select valid start and end dates/times.',
				actions: [{ icon: 'close' }]
			});
			return false;
		}
		return true;
	};

	const autoGenerateUrl = newName => {
		return encodeURI(
			newName
				.trim()
				.toLowerCase()
				.split(' ')
				.join('-')
				.replace(/[^a-z0-9-]/g, '')
		);
	};

	const toggleAllowedGrade = grade => {
		const allowedGrades = [...grades];
		const indexOfGrade = allowedGrades.indexOf(grade);

		if (indexOfGrade !== -1) {
			allowedGrades.splice(indexOfGrade, 1);
		} else {
			allowedGrades.push(grade);
		}

		setFormValue('grades', allowedGrades);
	};

	const handleNameChange = ev => {
		const newName = ev.target.value;
		setFormValue('name', newName);

		const newUrl = autoGenerateUrl(newName);
		setFormValue('publicUrl', newUrl);
	};

	const setPicture = newPicture => {
		setFormValue('picture', newPicture);
	};

	return (
		<Grid className={classes.FormContainer}>
			<GridCell span={6} tablet={12}>
				<TextField
					outlined
					label="Name"
					name={'name'}
					value={name}
					onChange={handleNameChange}
					required
					className={classes.FullWidthInput}
					onBlur={checkPublicUrl}
				/>
			</GridCell>
			<GridCell span={6} tablet={12}>
				<TextField
					label="Election URL"
					name={'publicUrl'}
					outlined
					value={publicUrl}
					className={classes.FullWidthInput}
					onChange={defaultOnChangeHandler}
					required
					trailingIcon={publicUrlIcon}
					helpText={{
						persistent: false,
						validationMsg: false,
						children: (
							<span>
								Election will be accessible at{' '}
								{window.location.host}/elections/
								<strong>{publicUrl || '<election-url>'}</strong>
							</span>
						)
					}}
					onBlur={checkPublicUrl}
				/>
			</GridCell>

			<GridCell span={12}>
				<Select
					label="Election Type"
					enhanced
					outlined
					options={electionTypes}
					value={type}
					onChange={ev => setFormValue('type', ev.target.value)}
					className={classes.FullWidthInput}
				/>
			</GridCell>

			<GridCell span={12}>
				<Text>
					Timezone:{' '}
					<strong>
						{Intl.DateTimeFormat().resolvedOptions().timeZone}
					</strong>
				</Text>
			</GridCell>

			<GridCell span={6} tablet={12}>
				<GridRow>
					<GridCell span={7} tablet={12}>
						<TextField
							label="Start Date"
							name={'startDate'}
							type="date"
							icon={'calendar_today'}
							className={classes.FullWidthInput}
							value={startDate}
							outlined
							onChange={defaultOnChangeHandler}
						/>
					</GridCell>

					<GridCell span={5} tablet={12}>
						<TextField
							label="Start Time"
							name={'startTime'}
							type="time"
							icon={'schedule'}
							className={classes.FullWidthInput}
							value={startTime}
							outlined
							onChange={defaultOnChangeHandler}
						/>
					</GridCell>
				</GridRow>
			</GridCell>

			<GridCell span={6} tablet={12}>
				<GridRow>
					<GridCell span={7} tablet={12}>
						<TextField
							label="End Date"
							name={'endDate'}
							type="date"
							icon={'event'}
							value={endDate}
							outlined
							onChange={defaultOnChangeHandler}
							className={classes.FullWidthInput}
						/>
					</GridCell>

					<GridCell span={5} tablet={12}>
						<TextField
							label="End Time"
							type="time"
							name={'endTime'}
							icon={'alarm'}
							className={classes.FullWidthInput}
							value={endTime}
							outlined
							onChange={defaultOnChangeHandler}
						/>
					</GridCell>
				</GridRow>
			</GridCell>

			<GridCell span={12}>
				<br />
				<Switch
					checked={visible}
					onChange={() => setFormValue('visible', !visible)}
					label={<span>&nbsp;Is Publicly Visible</span>}
				/>
			</GridCell>

			<GridCell span={12}>
				<Title level={5}>Allowed Grades:</Title>
			</GridCell>

			<GridCell span={6}>
				<GridRow>
					{allGrades.map(grade => (
						<GridCell span={3} key={grade}>
							<Checkbox
								label={grade}
								checked={grades.includes(grade)}
								onChange={() => toggleAllowedGrade(grade)}
							/>
						</GridCell>
					))}
				</GridRow>
			</GridCell>

			<GridCell span={12}>
				<Title level={5}>Election Picture:</Title>

				{picture && (
					<img
						src={urlJoin(
							API_URL,
							`/api/s3`,
							picture,
							`?width=300`,
							`?height=225`,
							`?crop=fill`,
							`?flags=lossy`,
							`?quality=90`
						)}
						className={classes.SelectedImage}
						alt={'Selected'}
					/>
				)}

				<ElectionPicDialog
					setSelectedPic={setPicture}
					selectedPic={picture}
				/>
			</GridCell>

			<GridCell span={12}>
				<Button
					raised
					onClick={() => preSubmitCheck() && onSubmit()}
					className={classes.SubmitButton}
				>
					Submit
				</Button>
			</GridCell>
		</Grid>
	);
};

export default ElectionDataForm;
