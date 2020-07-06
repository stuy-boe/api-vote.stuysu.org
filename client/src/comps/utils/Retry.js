// @flow
import React from 'react';

import type { Node } from 'react';

import { Button } from '@rmwc/button';
import '@material/button/dist/mdc.button.css';
import Title from '../../typography/Title';
import FlexCenter from './FlexCenter';
import ConfusedPersonVector from '../../vectors/confused-person.svg';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	Image: {
		width: '400px',
		maxWidth: '80%',
		margin: '5%',
		marginBottom: '4rem'
	},
	Text: { color: props => props.textColor }
});

type Props = {
	onRetry: Function,
	message: string | Node,
	fullHeight: boolean,
	image: string,
	textColor: string,
	buttonText: string
};

const Retry = (props: Props) => {
	const classes = useStyles({ textColor: props.textColor });
	return (
		<FlexCenter fullHeight={props.fullHeight}>
			<div>
				{typeof props.message === 'string' ? (
					// If the message is a string, enclose it in a heading
					<Title level={3} center className={classes.Text}>
						{props.message}
					</Title>
				) : (
					// Otherwise it is a component and we should render as-is
					props.message
				)}

				<FlexCenter>
					<img
						src={props.image}
						alt={'Cute vector to make user feel better'}
						className={classes.Image}
					/>
				</FlexCenter>

				<FlexCenter>
					<Button outlined onClick={props.onRetry}>
						{props.buttonText}
					</Button>
				</FlexCenter>
			</div>
		</FlexCenter>
	);
};

Retry.defaultProps = {
	fullHeight: true,
	image: ConfusedPersonVector,
	textColor: '#55597a',
	buttonText: 'Retry'
};

export default Retry;
