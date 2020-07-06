import React from 'react';

import { CircularProgress } from '@rmwc/circular-progress';
import '@rmwc/circular-progress/circular-progress.css';

import { Theme } from '@rmwc/theme';
import FlexCenter from './FlexCenter';
import Text from '../../typography/Text';

const Loading = props => {
	const [hasBeenSomeTime, setHasBeenSomeTime] = React.useState(false);

	React.useEffect(() => {
		// If the loading doesn't go away in 3 seconds
		// We need to make sure the user doesn't think the app crashed
		const timeoutId = setTimeout(setHasBeenSomeTime, 3000, true);

		// If the loading unmounts away before 3 seconds, delete the timeout
		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<FlexCenter fullHeight={props.fullHeight}>
			<div>
				<FlexCenter>
					<Theme use={'onPrimary'}>
						<CircularProgress size={72} />
					</Theme>
				</FlexCenter>

				{hasBeenSomeTime && (
					<div>
						<Text center>Sorry this is taking so long.</Text>
						<Text center>We think the server fell asleep.</Text>
						<Text center>
							This shouldn't take more than 10 seconds
						</Text>
					</div>
				)}
			</div>
		</FlexCenter>
	);
};

Loading.defaultProps = {
	fullHeight: true
};

export default Loading;
