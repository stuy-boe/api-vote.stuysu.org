import React from 'react';
import './App.css';

import {Content} from "./comps/Content";
import {AppBar} from "./comps/menu/AppBar";
import {NavDrawer} from "./comps/menu/NavDrawer";

function App() {
	const [drawerOpen, setDrawerOpen] = React.useState(true);

	const toggleDrawer = () => setDrawerOpen(! drawerOpen);

	return (
		<div className="App">
			<AppBar toggleDrawer={toggleDrawer}/>
			<NavDrawer drawerOpen={drawerOpen}>
				<Content/>
			</NavDrawer>
		</div>
	);
}

export default App;
