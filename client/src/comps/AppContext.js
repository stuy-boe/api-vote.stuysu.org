import React from "react";
import { withRouter } from 'react-router-dom';
import { splitUrl } from "../tools/splitUrl";

export const AppContext = React.createContext({initialized: false});

class AppProvider extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			initialized: false,
			path: []
		};
	}

	componentDidMount() {
		this.props.history.listen(location => {
			this.setState(state => {
				state.path = splitUrl(location.pathname);
				return state;
			});
		});
	}

	render(){
		return (
			<AppContext.Provider value={this.state}>
				{this.props.children}
			</AppContext.Provider>
		);
	}

}

export default withRouter(AppProvider);


