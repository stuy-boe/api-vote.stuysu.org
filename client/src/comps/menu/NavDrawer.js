import React from 'react';
import {
	Drawer,
	DrawerAppContent,
	DrawerContent,
	DrawerHeader,
	DrawerSubtitle,
	DrawerTitle
} from '@rmwc/drawer';
import '@material/drawer/dist/mdc.drawer.css';

import { List, SimpleListItem } from '@rmwc/list';

import '@material/list/dist/mdc.list.css';
import '@rmwc/list/collapsible-list.css';
import AppContext from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';
import backend from '../../tools/backend';

import { createUseStyles } from 'react-jss';
import ElectionItems from './ElectionItems';
import AdminItems from './AdminItems';

const useStyles = createUseStyles({
	NavDrawer: {
		borderRight: 0,
		position: 'fixed'
	},
	DrawerAppContent: {
		padding: '1rem'
	},
	DrawerLogo: {
		paddingTop: '1em',
		width: '100px'
	}
});

const NavDrawer = ({ toggleDrawer, drawerOpen, children }) => {
	const classes = useStyles();

	const context = React.useContext(AppContext);

	const location = useLocation();

	// On mobile devices, close the nav bar upon navigation
	const handleNavigation = () => {
		if (window.innerWidth < 800 && drawerOpen) {
			toggleDrawer(false);
		}
	};

	React.useEffect(handleNavigation, [location]);

	const attemptLogout = () => {
		backend.get('/api/auth/logout').then(() => {
			context.updateState();
		});
	};

	return (
		<div>
			<Drawer dismissible open={drawerOpen} className={classes.NavDrawer}>
				<DrawerHeader>
					<img
						src={'/img/logo100.png'}
						alt={'StuyBOE Logo'}
						className={classes.DrawerLogo}
					/>
					<DrawerTitle>
						{context.signedIn ? context.user.name : 'Not Signed In'}
					</DrawerTitle>
					<DrawerSubtitle>
						{context.signedIn ? context.user.email : ''}
					</DrawerSubtitle>
				</DrawerHeader>

				<DrawerContent className={['DrawerContent']}>
					<List>
						{context.signedIn && (
							<SimpleListItem
								graphic="power_settings_new"
								text="Sign Out"
								onClick={attemptLogout}
							/>
						)}

						{context.signedIn && context.admin.status && (
							<AdminItems />
						)}

						{context.signedIn && context.campaignManager.status && (
							<MenuItem
								to={'/campaign'}
								text={'Campaign'}
								icon={'assignment_ind'}
								activeRoute={'/campaign'}
							/>
						)}

						<MenuItem
							to={'/'}
							text={'Your Feed'}
							icon={'home'}
							activeRoute={'/'}
							exactRoute
						/>

						<ElectionItems />

						<MenuItem
							to={'/contact'}
							text={'Contact Us'}
							icon={'chat_bubble'}
							activeRoute={'/contact'}
						/>

						<MenuItem
							to={'/help'}
							text={'Help'}
							icon={'help'}
							activeRoute={'/help'}
						/>
					</List>
				</DrawerContent>
			</Drawer>

			<DrawerAppContent className={classes.DrawerAppContent}>
				{children}
			</DrawerAppContent>
		</div>
	);
};

export default NavDrawer;
