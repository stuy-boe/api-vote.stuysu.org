import React from 'react';
import './App.css';

import {Content} from "./comps/Content";
import {AppBar} from "./comps/menu/AppBar";
import {NavDrawer} from "./comps/menu/NavDrawer";
import {BrowserRouter} from "react-router-dom";
import AppProvider from "./comps/AppContext";

import {SnackbarQueue} from "@rmwc/snackbar";
import {MessageQueue} from "./comps/MessageQueue";
import '@material/snackbar/dist/mdc.snackbar.css';
import '@material/button/dist/mdc.button.css';

function App() {
	const [drawerOpen, setDrawerOpen] = React.useState(true);

	const toggleDrawer = () => setDrawerOpen(! drawerOpen);

	return (
		<div className="App">
			<BrowserRouter>
				<AppProvider>
					<AppBar toggleDrawer={toggleDrawer}/>
					<NavDrawer drawerOpen={drawerOpen}>
						<Content/>
					</NavDrawer>
				</AppProvider>
			</BrowserRouter>

			<SnackbarQueue messages={MessageQueue.messages}/>
		</div>
	);

}

export default App;
