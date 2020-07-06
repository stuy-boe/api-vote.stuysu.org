// @flow
import React from 'react';
import type { Node } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	FlexCenter: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: props => props.height
	}
});

type PropTypes = {
	children: Node,
	fullHeight: boolean,
	height: string,
	className: string
};

const FlexCenter = (props: PropTypes) => {
	const fullHeight = Boolean(props.fullHeight);
	const height = fullHeight ? '100%' : props.height;
	const classes: Object = useStyles({ height });

	return (
		<div className={`${classes.FlexCenter} ${props.className}`}>
			{props.children}
		</div>
	);
};

FlexCenter.defaultProps = {
	children: <></>,
	fullHeight: false,
	height: '',
	className: ''
};

export default FlexCenter;
