import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	Obfuscator: {
		height: '100%',
		width: '100%',
		position: 'fixed',
		backgroundColor: 'black',
		opacity: 0.85,
		marginTop: '-1rem',
		zIndex: 20
	}
});

const Obfuscator = ({ open, toggleDrawer }) => {
	const classes = useStyles();

	if (!open) return null;

	return (
		<div
			className={classes.Obfuscator}
			onClick={() => toggleDrawer(false)}
		/>
	);
};

export default Obfuscator;
