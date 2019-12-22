import React from "react";

import {Drawer, DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerContent} from "@rmwc/drawer";
import '@material/drawer/dist/mdc.drawer.css';
import {DrawerAppContent} from "@rmwc/drawer";

import {List, CollapsibleList, SimpleListItem} from "@rmwc/list";
import '@material/list/dist/mdc.list.css';
import '@rmwc/list/collapsible-list.css';
import {AppContext} from "../AppProvider";
import {Link} from "react-router-dom";

export const NavDrawer = (props) => {
	const context = React.useContext(AppContext);

	const pathMatches = (index, value, path = context.path) => {
		return path[index] === value;
	};

	const getModifiedPath = (index, val) => {
		let new_path = [...context.path];
		new_path[index] = val;
		return "/" + new_path.join("/");
	};

	return (
		<div style={{ }}>
			<Drawer dismissible open={props.drawerOpen} className={["NavDrawer"]} style={{position: "fixed"}}>
				<DrawerHeader>
					<img src={"/logo192.png"} width={100} alt={"StuyBOE Logo"} style={{paddingTop: '1em'}}/>
					<DrawerTitle>{context.signed_in ? context.user.name : "Not Signed In"}</DrawerTitle>
					<DrawerSubtitle>{context.signed_in ? context.user.email: ""}</DrawerSubtitle>
				</DrawerHeader>

				<DrawerContent className={["DrawerContent"]}>

					<List>
						{/*TODO ADD SIGNOUT and ADMIN and CAMPAIGNING ITEMS*/}

						<Link to={"/"}>
							<SimpleListItem
								activated={typeof context.path[0] === "undefined"}
								graphic="home"
								text="Your Feed"
							/>
						</Link>

						<CollapsibleList
							handle={
								<Link to={"/elections"}>
									<SimpleListItem
										text="Elections"
										graphic="how_to_vote"
										metaIcon="chevron_right"
										activated={pathMatches(0, "elections") && typeof context.path[1] === "undefined"}
									/>
								</Link>
							}
							open={typeof context.path[1] !== "undefined"}
						>
							<Link to={getModifiedPath(2, "")} >
								<SimpleListItem
									activated={typeof context.path[2] === "undefined"}
									text="Overview"
									graphic="dashboard"
								/>
							</Link>

							<Link to={getModifiedPath(2, "candidates")} >
								<SimpleListItem
									activated={pathMatches(2, "candidates")}
									text="Candidates"
									graphic="people"
								/>
							</Link>

							<Link to={getModifiedPath(2, "vote")} >
								<SimpleListItem
									activated={pathMatches(2, "vote")}
									text="Vote"
									graphic="where_to_vote"
								/>
							</Link>
						</CollapsibleList>

						<Link to={"/contact"} >
							<SimpleListItem
								activated={pathMatches(0, "contact")}
								text="Contact Us"
								graphic="chat_bubble"
							/>
						</Link>

						<Link to={"/help"} >
							<SimpleListItem
								activated={pathMatches(0, "help")}
								text="Help"
								graphic="help"
							/>
						</Link>

					</List>
				</DrawerContent>
			</Drawer>

			<DrawerAppContent style={{ minHeight: 'calc(100vh - 65px)', padding: '1rem' }}>
				{props.children}
			</DrawerAppContent>
		</div>
	);
};
