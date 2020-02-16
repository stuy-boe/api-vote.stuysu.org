import React from "react";

import {Button} from "@rmwc/button";
import '@material/button/dist/mdc.button.css';

import {CircularProgress} from "@rmwc/circular-progress";
import '@rmwc/circular-progress/circular-progress.css';


export const AppContext = React.createContext({initialized: false});

export class AppProvider extends React.Component {

	constructor(props) {
		super(props);

		this.updateState = this.updateState.bind(this);
		this.state = {
			initialized: false,
			signedIn: false,
			user: {},
			admin: {},
			campaign: {},
			updateState: this.updateState,
			error: false
		};

	}

	updateState() {
		this.setState({error: false});
		fetch("/api/state", {cache: "no-store"})
			.then(res => res.json())
			.then(data => {
				data.initialized = true;
				this.setState(data);
			})
			.catch(er => {
				this.setState({error: true});
			});
	}

	componentDidMount() {
		this.updateState();
	}

	render(){

		if(this.state.error)
			return (
				<div style={{paddingTop: "calc(50vh - 72px)"}}>
					{/*	Error screen with a refresh button */}
					<h3 style={{textAlign: "center"}}>There was an error loading the app</h3>

					<div className={["flex-center"]}>
						<Button outlined onClick={this.updateState}>Retry</Button>
					</div>
				</div>
			);

		if(! this.state.initialized)
			return (
				<div
					className={["flex-center"]}
					style={{
						paddingTop: "calc(50vh - 72px)"
					}}
				>
					{/*	Loading Screen */}
					<CircularProgress size={72} />
				</div>
			);

		return (
			<AppContext.Provider value={this.state}>
				{this.props.children}
			</AppContext.Provider>
		);
	}

}


