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

	}

	componentDidMount() {
		fetch("/api/elections/all")
			.then(res => res.json())
			.then(data => this.setState(data))
			.catch(er => {
				MessageQueue.notify({
					body: "Could not fetch elections. Check your network connection.",
					actions: [{"icon": "close"}]
				});
			})
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
