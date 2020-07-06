// @flow
import React from 'react';
import { Theme } from '@rmwc/theme';
import { createUseStyles } from 'react-jss';
import clampNumber from '../tools/clampNumber';

const useStyles = createUseStyles({
	Title: {
		fontSize: props => `${3.4 - props.level * 0.4}rem`,
		textAlign: props => (props.center ? 'center' : null)
	}
});

type Props = {
	children: string,
	center: boolean,
	style: Object,
	className: string,
	level: number,
	theme: string
};

const Title = (props: Props) => {
	const styles = props.style;

	const level = clampNumber(props.level, 1, 6) || 1;

	const center = Boolean(props.center);

	const classes: Object = useStyles({ level, center });

	const classesString = `${classes.Title} ${props.className}`;

	return (
		<Theme use={props.theme}>
			<h1 style={styles} className={classesString}>
				{props.children}
			</h1>
		</Theme>
	);
};

Title.defaultProps = {
	children: '',
	center: false,
	style: {},
	className: '',
	level: 1,
	theme: 'textPrimaryOnBackground'
};

export default Title;
