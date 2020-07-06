import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@rmwc/icon/icon.css';

import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import React from 'react';
import { createUseStyles } from 'react-jss';
import useIsOnline from '../../tools/useIsOnline';

const useStyles = createUseStyles({
	AppBar: { backgroundColor: 'white', color: 'black', zIndex: 99 },
	Title: { fontFamily: `'Sumana', serif` },
	OfflineIndicator: { color: 'grey' }
});

const AppBar = props => {
	const isOnline = useIsOnline();
	const classes = useStyles();

	return (
		<div>
			<SimpleTopAppBar
				title={
					<span className={classes.Title}>
						Board of Elections{' '}
						{!isOnline && (
							<span className={classes.OfflineIndicator}>
								| Offline App
							</span>
						)}
					</span>
				}
				navigationIcon={true}
				onNav={() => props.toggleDrawer()}
				className={classes.AppBar}
				fixed
			/>
			<TopAppBarFixedAdjust />
		</div>
	);
};

export default AppBar;
