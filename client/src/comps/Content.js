import React from "react";
import {AuthButton} from "./AuthButton";
import {AppContext} from "./AppProvider";
import {Switch, Route} from "react-router-dom";

export const Content = (props) => {
	const context = React.useContext(AppContext);


	return (
		<div>
			<Switch>
				<Route path="/" component={Hello} exact/>
			</Switch>

			{
				! context.signed_in &&
				<AuthButton/>
			}
		</div>
	)
};

function Hello() {
	return <h1>Hello World!</h1>;
}
