// @flow
import React from 'react';
import { Theme } from '@rmwc/theme';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	Subtitle: {
		fontSize: '0.8rem',
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

const Subtitle = (props: Props) => {
	const center = Boolean(props.center);
	const classes: Object = useStyles({ center });

	const styles = props.style;

	const classesString = `${classes.Subtitle} ${props.className}`;

	return (
		<Theme use={props.theme}>
			<span style={styles} className={classesString}>
				{props.children}
			</span>
		</Theme>
	);
};

Subtitle.defaultProps = {
	children: '',
	center: false,
	style: {},
	className: [],
	theme: 'textHintOnBackground'
};

export default Subtitle;
