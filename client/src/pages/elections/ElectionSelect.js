import React from "react";
import {MessageQueue} from "../../comps/MessageQueue";
import {ElectionCard} from "./ElectionCard";

import {Grid, GridCell} from "@rmwc/grid";
import '@material/layout-grid/dist/mdc.layout-grid.css';

export class ElectionSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: [],
			completed: []
		};

		this.setStateFromCache = this.setStateFromCache.bind(this);
		this.setStateFromFetch = this.setStateFromFetch.bind(this);
	}

	setStateFromCache(){
		// The API call is cached to SessionStorage for 1 hour or until the browser session restarts
		let ss = window.sessionStorage;
		let elections_cache = ss.getItem("elections");

		if(elections_cache){
			// Verify the cache was updated within the last 15 min
			let last_updated = new Date(ss.getItem("elections_updated"));
			if(new Date() - last_updated < (1000 * 60 * 15)){
				// If the cache is recent and a valid json, skip the api call
				try {
					let elections = JSON.parse(elections_cache);
					this.setState(elections);
					return true;
				} catch(e) {}
			}
		}
		return false;
	}

	setStateFromFetch(){
		fetch("/api/elections")
			.then(res => res.json())
			.then(data => {
				window.sessionStorage.setItem("elections", JSON.stringify(data));
				window.sessionStorage.setItem("elections_updated", new Date().toISOString());
				this.setState(data);
			})
			.catch(er => {
				MessageQueue.notify({
					body: "Could not fetch elections. Check your network connection.",
					actions: [{"icon": "close"}]
				});
			});
	}

	componentDidMount() {
		if(! this.setStateFromCache())
			this.setStateFromFetch();
	}

	render() {
		return (
			<div>
				<h2>Active Elections:</h2>
				<Grid fixedColumnWidth align={"left"}>
					{this.state.active.map(election => (
						<ElectionCell election={election} key={election.public_url} />
					))}
				</Grid>

				<h2>Completed Elections:</h2>
				<Grid fixedColumnWidth align={"left"}>
					{this.state.completed.map(election => (
						<ElectionCell election={election} key={election.public_url} />
					))}
				</Grid>
			</div>
		)
	}
}

const ElectionCell = ({election}) => (
	<GridCell span={4}>
		<ElectionCard to={"/elections/:public_url"} election={election}/>
	</GridCell>
);
