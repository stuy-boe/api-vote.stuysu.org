import React from "react";
import {AuthButton} from "./AuthButton";
import {AppContext} from "./AppProvider";
import {Switch, Route} from "react-router-dom";
import {ElectionSwitch} from "../pages/elections/ElectionSwitch";

export const Content = (props) => {
	const context = React.useContext(AppContext);

	return (
		<div>
			<Switch>
				<Route path={"/"} component={Hello} exact/>
				<Route path={"/elections"} component={ElectionSwitch}/>
			</Switch>

			{
				! context.signedIn &&
				<AuthButton/>
			}
		</div>
	)
};

function Hello() {
	return <h1>Hello World!</h1>;
}
