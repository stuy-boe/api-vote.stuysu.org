import React from "react";

import {Drawer, DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerContent} from "@rmwc/drawer";
import '@material/drawer/dist/mdc.drawer.css';
import {DrawerAppContent} from "@rmwc/drawer";


export const NavDrawer = (props) => {
	return (
		<div style={{ overflow: 'hidden', position: 'relative' }}>
			<Drawer dismissible open={props.drawerOpen} className={["NavDrawer"]}>
				<DrawerHeader>
					<DrawerTitle>DrawerHeader</DrawerTitle>
					<DrawerSubtitle>Subtitle</DrawerSubtitle>
				</DrawerHeader>
				<DrawerContent>

				</DrawerContent>
			</Drawer>

			<DrawerAppContent style={{ minHeight: '15rem', padding: '1rem' }}>
				{props.children}
			</DrawerAppContent>
		</div>
	);
};
