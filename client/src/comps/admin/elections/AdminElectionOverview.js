import React from 'react';
import AdminElectionContext from './AdminElectionContext';
import Title from '../../../typography/Title';
import BackButton from '../../utils/BackButton';

const AdminElectionOverview = () => {
	const election = React.useContext(AdminElectionContext);

	return (
		<div>
			<BackButton text={'Manage Elections'} to={'/admin/elections'} />
			<Title level={2} center>
				{election.name}
			</Title>
			<pre>{JSON.stringify(election, null, 2)}</pre>
		</div>
	);
};
export default AdminElectionOverview;
