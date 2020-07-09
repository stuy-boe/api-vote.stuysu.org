import React from 'react';
import AdminElectionOverview from './AdminElectionOverview';
import { Route, Switch, useParams } from 'react-router-dom';
import AdminElectionContext from './AdminElectionContext';
import Loading from '../../utils/Loading';
import Retry from '../../utils/Retry';
import ErrorPage from '../../../pages/ErrorPage';
import SearchingVector from '../../../vectors/searching.svg';
import BackButton from '../../utils/BackButton';
import EditElection from './EditElection';
import useApi from '../../../tools/useApi';

const AdminSelectedElectionRouter = ({ match }) => {
	const { publicUrl } = useParams();
	const api = useApi(`/api/admin/elections/${publicUrl}`);
	const error = api.error;
	const election = api.data;
	const updateData = api.updateData;

	if (error?.response?.status === 404) {
		return (
			<ErrorPage
				title={'Election Not Found'}
				image={SearchingVector}
				back={
					<BackButton
						text={'Manage Elections'}
						to={'/admin/elections'}
					/>
				}
			/>
		);
	}

	if (error) {
		return (
			<Retry
				onRetry={updateData}
				message={'There was an error getting the election information.'}
			/>
		);
	}

	if (election === null) {
		return <Loading />;
	}

	const data = { ...election, reload: updateData };

	return (
		<AdminElectionContext.Provider value={data}>
			<Switch>
				<Route
					path={match.path}
					exact
					component={AdminElectionOverview}
				/>

				<Route path={`${match.path}/candidates/create`} />
				<Route path={`${match.path}/edit`} component={EditElection} />
			</Switch>
		</AdminElectionContext.Provider>
	);
};

export default AdminSelectedElectionRouter;
