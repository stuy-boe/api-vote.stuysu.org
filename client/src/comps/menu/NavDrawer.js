import React from "react";
import {Drawer, DrawerAppContent, DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle} from "@rmwc/drawer";
import '@material/drawer/dist/mdc.drawer.css';

import {CollapsibleList, List, SimpleListItem} from "@rmwc/list";
import '@material/list/dist/mdc.list.css';
import '@rmwc/list/collapsible-list.css';
import {AppContext} from "../AppProvider";
import {useLocation, useRouteMatch} from "react-router-dom";
import {MessageQueue} from "../MessageQueue";
import {splitPath} from "../../tools/splitPath";
import {MenuItem} from "./MenuItem";

export const NavDrawer = (props) => {
	const context = React.useContext(AppContext);

	const location = useLocation();

	const getModifiedPath = (index, val) => {
		let new_path = splitPath(location.pathname);
		new_path[index] = val;
		return "/" + new_path.join("/");
	};

	const attemptLogout = () => {
		fetch("/auth/logout")
			.then(res => res.json())
			.then(data => {
				if(data.success)
					context.updateState();
				else throw new Error();
			})
			.catch(() => {
				MessageQueue.notify({
					body: "Could not sign out. Check your network connection.",
					actions: [{"icon": "close"}]
				});
			});
	};

	let electionIsSelected = useRouteMatch("/elections/:id");

	return (
		<div style={{ }}>
			<Drawer dismissible open={props.drawerOpen} className={["NavDrawer"]} style={{position: "fixed"}}>
				<DrawerHeader>
					<img src={"/logo192.png"} width={100} alt={"StuyBOE Logo"} style={{paddingTop: '1em'}}/>
					<DrawerTitle>{context.signedIn ? context.user.name : "Not Signed In"}</DrawerTitle>
					<DrawerSubtitle>{context.signedIn ? context.user.email: ""}</DrawerSubtitle>
				</DrawerHeader>

				<DrawerContent className={["DrawerContent"]}>

					<List onClick={() => window.innerWidth < 600 && props.toggleDrawer()}>
						{
							context.signedIn &&
							<SimpleListItem
								graphic="power_settings_new"
								text="Sign Out"
								onClick={attemptLogout}
							/>
						}

						{
							context.signedIn &&
							context.admin.is_admin &&
							<MenuItem
								to={"/admin"}
								text={"Admin"}
								icon={"build"}
								activeRoute={"/admin"}
							/>
						}

						{
							context.signedIn &&
							context.campaign.is_manager &&
							<MenuItem
								to={"/campaign"}
								text={"Campaign"}
								icon={"assignment_ind"}
								activeRoute={"/campaign"}
							/>
						}


						<MenuItem
							to={"/"}
							text={"Your Feed"}
							icon={"home"}
							activeRoute={"/"}
							exactRoute
						/>

						<CollapsibleList
							handle={
								<MenuItem
									to={"/elections"}
									text={"Elections"}
									icon={"how_to_vote"}
									activeRoute={"/elections"}
									metaIcon={"chevron_right"}
									exactRoute
								/>
							}
							open={electionIsSelected}
						>

							<MenuItem
								to={getModifiedPath(2, "")}
								text={"Overview"}
								icon={"dashboard"}
								activeRoute={"/elections/:id"}
								exactRoute
							/>


							<MenuItem
								to={getModifiedPath(2, "candidates")}
								text={"Candidates"}
								icon={"people"}
								activeRoute={"/elections/:id/candidates"}
							/>

							<MenuItem
								to={getModifiedPath(2, "vote")}
								text={"Vote"}
								icon={"where_to_vote"}
								activeRoute={"/elections/:id/vote"}
							/>

							<MenuItem
								to={getModifiedPath(2, "results")}
								text={"Results"}
								icon={"ballot"}
								activeRoute={"/elections/:id/results"}
								fillParams
							/>
						</CollapsibleList>

						<MenuItem
							to={"/contact"}
							text={"Contact Us"}
							icon={"chat_bubble"}
							activeRoute={"/contact"}
						/>

						<MenuItem
							to={"/help"}
							text={"Help"}
							icon={"help"}
							activeRoute={"/help"}
						/>

					</List>
				</DrawerContent>
			</Drawer>

			<DrawerAppContent style={{ padding: '1rem' }}>
				{props.children}
			</DrawerAppContent>
		</div>
	);
};

