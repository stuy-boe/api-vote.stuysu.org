import React from "react";
import {AuthButton} from "./AuthButton";
import {AppContext} from "./AppProvider";

export const Content = (props) => {
	const context = React.useContext(AppContext);

	return (
		<div>
			{
				! context.signed_in &&
				<AuthButton/>
			}
		</div>
	)
};
