// @flow
import React from 'react';
import { Button } from '@rmwc/button';
import { Link } from 'react-router-dom';
type PropTypes = {
	text: string,
	to: string
};

const BackButton = (props: PropTypes) => {
	return (
		<Link to={props.to}>
			<Button icon={'arrow_back_ios'}>{props.text}</Button>
		</Link>
	);
};

export default BackButton;
