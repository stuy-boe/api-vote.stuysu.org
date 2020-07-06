import React from 'react';
import MenuItem from './MenuItem';
import { CollapsibleList, SimpleListItem } from '@rmwc/list';
import AppContext from '../context/AppContext';
import { useRouteMatch, useLocation } from 'react-router-dom';

const meta = {
	elections: {
		icon: 'poll',
		title: 'Elections'
	},
	posters: {
		icon: 'find_in_page',
		title: 'Poster Review'
	}
};

const AdminItems = () => {
	const adminBaseRoute = `/admin`;
	const routeMatch = useRouteMatch(adminBaseRoute);
	const [isOpen, setIsOpen] = React.useState(Boolean(routeMatch));
	const context = React.useContext(AppContext);
	const location = useLocation();

	const privileges = context.admin.privileges || [];

	const handleNavigationOut = () => {
		if (isOpen && !routeMatch) {
			setIsOpen(false);
		}
	};

	React.useEffect(handleNavigationOut, [routeMatch, location]);

	return (
		<CollapsibleList
			handle={
				<SimpleListItem
					activated={routeMatch && routeMatch.isExact}
					text={'Admin'}
					graphic={'build'}
					metaIcon={'chevron_right'}
				/>
			}
			onClick={() => {
				if (!routeMatch) {
					setIsOpen(!isOpen);
				}
			}}
			open={isOpen || routeMatch}
		>
			{privileges.map(privilege => {
				return (
					<MenuItem
						to={`${adminBaseRoute}/${privilege}`}
						text={meta[privilege].title}
						activeRoute={`${adminBaseRoute}/${privilege}`}
						icon={meta[privilege].icon}
						key={privilege}
					/>
				);
			})}
		</CollapsibleList>
	);
};

export default AdminItems;
