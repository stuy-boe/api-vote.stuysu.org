import React from 'react';

import {
	Card,
	CardActionButton,
	CardActionButtons,
	CardActions,
	CardMedia,
	CardPrimaryAction
} from '@rmwc/card';
import '@material/card/dist/mdc.card.css';
import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';

import { generatePath, Link } from 'react-router-dom';

import moment from 'moment';

import urlJoin from 'url-join';

import { API_URL } from '../../constants';
import AppContext from '../context/AppContext';

import { createUseStyles } from 'react-jss';
import Title from '../../typography/Title';
import Subtitle from '../../typography/Subtitle';

import MediaErrorVector from '../../vectors/media-error.svg';

const useStyles = createUseStyles({
	Media: {
		backgroundImage: props =>
			`url(${props.electionPic}), url(${MediaErrorVector})`
	},
	TextContainer: {
		padding: '0 1rem 1rem 1rem'
	},
	Title: {
		fontWeight: 400,
		marginBottom: '0.2rem'
	}
});

const ElectionCard = props => {
	const start = new Date(props.startTime);
	const end = new Date(props.endTime);

	const context = React.useContext(AppContext);

	const [now, setNow] = React.useState(context.getDate());

	const updateNow = () => {
		if (!props.completed && now <= end) {
			// We passed it as a function object to prevent calling it immediately
			const timeoutID = setTimeout(() => setNow(context.getDate()), 1000);

			// In the case that the component unmounts before the timeout goes off
			// Clear the timeout to prevent setting the state of an unmounted component
			return () => clearTimeout(timeoutID);
		}
	};

	React.useEffect(updateNow, [now]);

	let to = generatePath(props.to, { publicUrl: props.publicUrl });

	const electionPic = urlJoin(
		API_URL,
		'/api/s3',
		props.picture,
		`?width=400`,
		`?flags=lossy`,
		`?quality=95`,
		`?background=white`
	);

	const classes = useStyles({ electionPic });

	return (
		<Card>
			<Link to={to}>
				<CardPrimaryAction>
					<CardMedia sixteenByNine className={classes.Media} />

					<div className={classes.TextContainer}>
						<Title level={5} className={classes.Title}>
							{props.name}
						</Title>

						<Subtitle className={classes.Subtitle}>
							Starts:{' '}
							{moment(start).format('MMM Do, YYYY hh:mma')}
						</Subtitle>
					</div>
				</CardPrimaryAction>
			</Link>

			<CardActions>
				<CardActionButtons>
					<Link to={to}>
						<CardActionButton>View</CardActionButton>
					</Link>
				</CardActionButtons>
			</CardActions>
		</Card>
	);
};

export default ElectionCard;
