import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { SimpleListItem } from '@rmwc/list';
import useModifiedRoute from '../../tools/useModifiedRoute';

const MenuItem = props => {
	let activated = useRouteMatch(props.activeRoute);
	if (Boolean(activated) && props.exactRoute) activated = activated.isExact;

	const baseRoute = props.baseRoute || '/';

	const to = useModifiedRoute(props.to, baseRoute);

	return (
		<Link to={to}>
			<SimpleListItem
				activated={Boolean(activated)}
				text={props.text}
				graphic={props.icon}
				metaIcon={props.metaIcon}
			/>
		</Link>
	);
};

export default MenuItem;
