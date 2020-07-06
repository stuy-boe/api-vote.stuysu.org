import React from 'react';
import { ElectionContext } from './SelectedElectionRouter';
import Loading from '../../utils/Loading';
import { Helmet } from 'react-helmet';
import Retry from '../../utils/Retry';
import useApi from '../../../tools/useApi';

const Candidates = () => {
	const election = React.useContext(ElectionContext);
	const { data: candidates, error, updateData } = useApi(
		`/api/elections/${election.publicUrl}/candidates`
	);

	if (error !== null) {
		return (
			<Retry
				onRetry={updateData}
				message={'There was an error getting the candidates'}
			/>
		);
	}

	if (candidates === null) {
		return <Loading />;
	}

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
