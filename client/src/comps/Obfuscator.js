import React from "react";

export const Obfuscator = ({open, toggleDrawer}) => {
	if(! open) return null;

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				position: "fixed",
				backgroundColor: "black",
				opacity: 0.85,
				marginTop: "-1rem",
				zIndex: 20
			}}
			onClick={toggleDrawer}
		>
		</div>
	)
};
