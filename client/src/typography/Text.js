// @flow
import React from 'react';
import { Theme } from '@rmwc/theme';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	Text: {
		textAlign: props => (props.center ? 'center' : null)
	}
});

type Props = {
	children: string,
	center: boolean,
	style: Object,
	className: string,
	theme: string
};

const Text = (props: Props) => {
	const styles = props.style;

	const center = Boolean(props.center);
	const classes: Object = useStyles({ center });

	const classesString = `${classes.Text} ${props.className}`;

	return (
		<Theme use={props.theme}>
			<p style={styles} className={classesString}>
				{props.children}
			</p>
		</Theme>
	);
};

Text.defaultProps = {
	children: '',
	center: false,
	style: {},
	className: '',
	theme: 'textPrimaryOnBackground'
};

export default Text;
