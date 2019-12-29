import React from "react";
import {Link} from "react-router-dom";

export const ElectionSelect = (props) => {
	return (
		<div>
			Select an election
			<br/>
			<Link to={"/elections/test"}>Test Election</Link>
		</div>
	);
};
