import React from 'react';
import './App.css';

import Content from './comps/Content';
import AppBar from './comps/menu/AppBar';
import NavDrawer from './comps/menu/NavDrawer';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './comps/context/AppProvider';

import { SnackbarQueue } from '@rmwc/snackbar';
import MessageQueue from './comps/queues/MessageQueue';
import '@material/snackbar/dist/mdc.snackbar.css';
import '@material/button/dist/mdc.button.css';
import Obfuscator from './comps/menu/Obfuscator';
import ThemeProvider from './comps/context/ThemeProvider';
import { DialogQueue as Dialogs } from '@rmwc/dialog';
import DialogQueue from './comps/queues/DialogQueue';
import '@rmwc/dialog/styles';

const App = () => {
	// If the device has a sufficiently large screen, the drawer is open by default
	const [drawerOpen, setDrawerOpen] = React.useState(window.innerWidth > 800);

	const toggleDrawer = newState => {
		if (!newState) {
			newState = !drawerOpen;
		}
		setDrawerOpen(newState);
	};

	window.onresize = event => {
		const shouldBeOpen = window.innerWidth > 800;

		if (event.isTrusted && drawerOpen !== shouldBeOpen) {
			setDrawerOpen(shouldBeOpen);
		}
	};

	return (
		<ThemeProvider>
			<div className="App">
				<BrowserRouter>
					<AppProvider>
						<AppBar toggleDrawer={toggleDrawer} />
						<NavDrawer
							drawerOpen={drawerOpen}
							toggleDrawer={toggleDrawer}
						>
							{/*We're not using the modal drawer */}
							{/*need to add our own obfuscator for mobile devices*/}
							<Obfuscator
								open={drawerOpen && window.innerWidth < 800}
								toggleDrawer={toggleDrawer}
							/>
							<Content />
						</NavDrawer>
					</AppProvider>
				</BrowserRouter>

				<SnackbarQueue
					messages={MessageQueue.messages}
					dismissesOnAction
					timeout={2000}
				/>
				<Dialogs dialogs={DialogQueue.dialogs} />
			</div>
		</ThemeProvider>
	);
};

export default App;
