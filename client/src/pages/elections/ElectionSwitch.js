import React from "react";
import {Route, Switch} from "react-router-dom";
import {ElectionSelect} from "./ElectionSelect";
import {Overview} from "./Overview";

export function ElectionSwitch(){
	return (
		<Switch>
			<Route path={"/elections"} exact component={ElectionSelect} />
			<Route path={"/elections/:public_url/"} exact component={Overview} />
		</Switch>
	)
}
