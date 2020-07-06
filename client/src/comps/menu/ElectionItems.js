import React from 'react';
import MenuItem from './MenuItem';
import { CollapsibleList } from '@rmwc/list';
import { useRouteMatch } from 'react-router-dom';

const ElectionItems = () => {
	const electionIsSelected = useRouteMatch('/elections/:id');

	const selectedElectionBaseRoute = '/elections/:publicUrl';
	return (
		<CollapsibleList
			handle={
				<MenuItem
					to={'/elections'}
					text={'Elections'}
					icon={'how_to_vote'}
					activeRoute={'/elections'}
					metaIcon={'chevron_right'}
					exactRoute
				/>
			}
			open={electionIsSelected}
		>
			<MenuItem
				to={selectedElectionBaseRoute}
				baseRoute={selectedElectionBaseRoute}
				text={'Overview'}
				icon={'dashboard'}
				activeRoute={selectedElectionBaseRoute}
				exactRoute
			/>

			<MenuItem
				to={`${selectedElectionBaseRoute}/candidates`}
				baseRoute={selectedElectionBaseRoute}
				text={'Candidates'}
				icon={'people'}
				activeRoute={`${selectedElectionBaseRoute}/candidates`}
			/>

			<MenuItem
				to={`${selectedElectionBaseRoute}/vote`}
				baseRoute={selectedElectionBaseRoute}
				text={'Vote'}
				icon={'where_to_vote'}
				activeRoute={`${selectedElectionBaseRoute}/vote`}
			/>

			<MenuItem
				to={`${selectedElectionBaseRoute}/results`}
				baseRoute={selectedElectionBaseRoute}
				text={'Results'}
				icon={'ballot'}
				activeRoute={`${selectedElectionBaseRoute}/results`}
			/>
		</CollapsibleList>
	);
};

export default ElectionItems;
