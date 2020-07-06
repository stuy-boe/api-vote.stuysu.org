import React from 'react';
import { List, SimpleListItem } from '@rmwc/list';
import Title from '../../../typography/Title';
import Loading from '../../utils/Loading';
import Retry from '../../utils/Retry';
import FlexCenter from '../../utils/FlexCenter';
import { Button } from '@rmwc/button';
import { Link } from 'react-router-dom';
import useApi from '../../../tools/useApi';

const ElectionsList = ({ match }) => {
	const { data: elections, error, updateData } = useApi(
		'/api/admin/elections'
	);

	return (
		<div>
			<Title level={2} center>
				Manage Elections
			</Title>
			<FlexCenter>
				<Link to={`${match.path}/create`}>
					<Button outlined>Create Election</Button>
				</Link>
			</FlexCenter>
			{elections === null && !error && <Loading />}
			{error && (
				<Retry
					onRetry={updateData}
					message={'There was an error getting the elections'}
				/>
			)}
			<List twoLine>
				{Array.isArray(elections) &&
					elections.map(election => {
						return (
							<Link
								to={`${match.path}/${election.publicUrl}`}
								key={election.id}
							>
								<SimpleListItem
									key={election.publicUrl}
									graphic={
										election.completed
											? 'offline_pin'
											: 'track_changes'
									}
									text={election.name}
									secondaryText={election.publicUrl}
									meta={<p>MANAGE</p>}
								/>
							</Link>
						);
					})}
			</List>
		</div>
	);
};

export default ElectionsList;
