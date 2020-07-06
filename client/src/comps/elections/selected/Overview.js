import React from 'react';
import { Helmet } from 'react-helmet';

import { ElectionContext } from './SelectedElectionRouter';

export function Overview(props) {
	const election = React.useContext(ElectionContext);

	return (
		<div>
			<Helmet>
				<title>{election.name} | Stuy BOE Voting Site</title>
				<meta
					property="og:title"
					content={`${election.name} | Stuy BOE Voting Site`}
				/>
				<meta
					property="og:description"
					content={`Overview of ${election.name}. Vote, view updates, learn about candidates and more.`}
				/>
			</Helmet>
			{election.name} is the current election
			{/*	TODO: Decide what content is displayed on the overview page with input from web team*/}
			{/* TODO: Create endpoint for posts from the candidates */}
		</div>
	);
}
