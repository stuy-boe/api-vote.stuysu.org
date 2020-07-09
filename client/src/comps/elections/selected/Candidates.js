import React from 'react';
import { ElectionContext } from './SelectedElectionRouter';
import { Helmet } from 'react-helmet';
import useApi from '../../../tools/useApi';

const Candidates = () => {
	const election = React.useContext(ElectionContext);
	const api = useApi(`/api/elections/${election.publicUrl}/candidates`, []);

	const candidates = api.data;

	return (
		<div>
			<Helmet>
				<title>
					Candidates: {election.name} | Stuy BOE Voting Site
				</title>
				<meta
					property="og:title"
					content={`Candidates: ${election.name} | Stuy BOE Voting Site`}
				/>
				<meta
					property="og:description"
					content={`Meet the candidates for ${election.name}.`}
				/>
			</Helmet>

			{/* TODO: Display the different candidates, ask web team for input */}
			{/* TODO Create individual page for candidate */}
			{JSON.stringify(candidates)}
		</div>
	);
};

export default Candidates;
