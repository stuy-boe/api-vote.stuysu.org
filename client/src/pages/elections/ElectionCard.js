import React from "react";

import {
	Card,
	CardActionButton,
	CardActionButtons,
	CardActionIcon,
	CardActionIcons,
	CardActions,
	CardMedia,
	CardPrimaryAction
} from "@rmwc/card";
import '@material/card/dist/mdc.card.css';
import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';

import {Typography} from "@rmwc/typography";
import '@material/typography/dist/mdc.typography.css';

import {generatePath, Link} from "react-router-dom";

import moment from "moment";

export const ElectionCard = (props) => {
	// noinspection JSCheckFunctionSignatures
	const start = new Date(props.election.start_time);
	// noinspection JSCheckFunctionSignatures
	const end = new Date(props.election.end_time);

	const [now, setNow] = React.useState(new Date());

	if (!props.election.completed && now <= end)
		setTimeout(setNow, 1000, new Date());

	let to = generatePath(props.to, props.election);

	return (
		<Card>
			<Link to={to} className={["UnstyledLink"]}>
				<CardPrimaryAction>
					<CardMedia
						sixteenByNine
						style={{backgroundImage: `url(${props.election.picture})`}}
					/>
					<div style={{padding: '0 1rem 1rem 1rem'}}>
						<Typography use="headline6" tag="h2">
							{props.election.name}
						</Typography>

						<Typography
							use="subtitle2"
							tag="h3"
							theme="textSecondaryOnBackground"
							style={{marginTop: '-1rem'}}
						>
							Starts: {moment(start).format("MMM Do, YYYY hh:mma")}
						</Typography>

						<Typography
							use="body1"
							tag="div"
							theme="textSecondaryOnBackground"
						>
							{props.election.public_results ?
								"Results are publicly visible" :
								"Results are not publicly visible"
							}
						</Typography>

					</div>
				</CardPrimaryAction>
			</Link>

			<CardActions>
				<CardActionButtons>

					<Link to={to} className={["UnstyledLink"]}>
						<CardActionButton>
							View
						</CardActionButton>
					</Link>

				</CardActionButtons>

				<CardActionIcons>
					{/*TODO ADD SHARE DIALOG*/}
					<CardActionIcon icon="share"/>
				</CardActionIcons>

			</CardActions>
		</Card>
	)
};
