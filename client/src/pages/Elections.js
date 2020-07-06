import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ElectionSelect from '../comps/elections/ElectionSelect';
import SelectedElectionRouter from '../comps/elections/selected/SelectedElectionRouter';

export const Elections = () => {
	return (
		<Switch>
			<Route path={'/elections'} exact component={ElectionSelect} />
			<Route
				path={'/elections/:publicUrl'}
				component={SelectedElectionRouter}
			/>
		</Switch>
	);
};
