import React from 'react';
import FlexCenter from '../comps/utils/FlexCenter';
import Title from '../typography/Title';
import AuthButton from '../comps/utils/AuthButton';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	ErrorImage: {
		width: '700px',
		maxWidth: '80%'
	}
});

const SignInRequired = () => {
	const classes = useStyles();

	return (
		<FlexCenter>
			<div>
				<Title level={2} center>
					Sign In Required
				</Title>
				<FlexCenter>
					<img
						className={classes.ErrorImage}
						src={'/img/sign-in-portal.svg'}
						alt={'Woman walking into a keyhole shaped portal'}
					/>
				</FlexCenter>
				<FlexCenter>
					<AuthButton />
				</FlexCenter>
			</div>
		</FlexCenter>
	);
};

export default SignInRequired;
