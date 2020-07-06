import React from 'react';
import FlexCenter from '../comps/utils/FlexCenter';
import Title from '../typography/Title';

import { createUseStyles } from 'react-jss';
import BackButton from '../comps/utils/BackButton';
import Text from '../typography/Text';

const useStyles = createUseStyles({
	ErrorImage: {
		width: '800px',
		maxWidth: '100%',
		maxHeight: '50vh'
	},
	Text: {
		color: '#23286a'
	},
	Subtitle: {
		color: 'grey'
	}
});

const ErrorPage = ({ title, image, subtitle, back, children }) => {
	const classes = useStyles();

	return (
		<div>
			{back || <BackButton text={'Back To Home'} to={'/'} />}

			<FlexCenter>
				<div>
					<Title level={2} center className={classes.Text}>
						{title}
					</Title>
					<FlexCenter>
						<img
							className={classes.ErrorImage}
							src={image}
							alt={'Error'}
						/>
					</FlexCenter>
					<Text center className={classes.Subtitle}>
						{subtitle}
					</Text>
					{children}
				</div>
			</FlexCenter>
		</div>
	);
};

export default ErrorPage;
