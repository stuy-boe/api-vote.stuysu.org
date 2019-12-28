import React from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {SimpleListItem} from "@rmwc/list";

export const MenuItem = (props) => {
	let activated = useRouteMatch(props.activeRoute);
	if (Boolean(activated) && props.exactRoute)
		activated = activated.isExact;

	return (
		<Link to={props.to}>
			<SimpleListItem
				activated={Boolean(activated)}
				text={props.text}
				graphic={props.icon}
				metaIcon={props.metaIcon}
			/>
		</Link>
	)
};
