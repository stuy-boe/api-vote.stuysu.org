import React from "react";

import {SimpleTopAppBar, TopAppBarFixedAdjust} from "@rmwc/top-app-bar";
import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@material/icon-button/dist/mdc.icon-button.css';

import '@rmwc/icon/icon.css';

export const AppBar = (props) => {
	return (
		<div>
			<SimpleTopAppBar
				title={<span style={{fontFamily: `'Sumana', serif`}}>Board of Elections</span>}
				navigationIcon
				onNav={props.toggleDrawer}
				className={["AppBar"]}
				fixed
				style={{zIndex: 99}}
			/>
			<TopAppBarFixedAdjust/>
		</div>
	);
};
