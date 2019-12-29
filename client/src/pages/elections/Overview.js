import React from "react";
import {useParams} from "react-router-dom";

export function Overview(props) {
	let { public_url } = useParams();

	return (
		<div>
			{public_url} is the current election
		</div>
	)
}
