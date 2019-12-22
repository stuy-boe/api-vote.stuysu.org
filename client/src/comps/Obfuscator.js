import React from "react";

export const Obfuscator = ({open}) => {
	if(! open) return null;

	return (
		<div style={{
			height: '100%',
			width: '100%',
			position: "fixed",
			backgroundColor: "#303030",
			opacity: 0.9,
			marginTop: "-1rem"
		}}>
		</div>
	)
};
