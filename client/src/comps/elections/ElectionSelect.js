import '@material/layout-grid/dist/mdc.layout-grid.css';

import { Grid, GridCell } from '@rmwc/grid';
import React from 'react';
import { Helmet } from 'react-helmet';
import { createUseStyles } from 'react-jss';
import useApi from '../../tools/useApi';

import ElectionCard from './ElectionCard';

const useStyles = createUseStyles({ ElectionsContainer: { maxWidth: '100%' } });

const ElectionSelect = () => {
	const api = useApi('/api/elections', { active: [], completed: [] });
	const elections = api.data;

	return (
		<div>
			<Helmet>
				<title>Elections | Stuy BOE Voting Site</title>
				<meta
					property="og:title"
					content="Elections | Stuy BOE Voting Site"
				/>
				<meta
					property="og:description"
					content="View results of elections from the past as well as up to date information about current elections."
				/>
			</Helmet>

			<h2>Active Elections:</h2>
			<ElectionGrid elections={elections.active} />

			<h2>Completed Elections:</h2>
			<ElectionGrid elections={elections.completed} />
		</div>
	);
};

const ElectionGrid = ({ elections }) => {
	const classes = useStyles();

	return (
		<Grid
			fixedColumnWidth
			align={'left'}
			className={classes.ElectionsContainer}
		>
			{elections.map(election => (
				<ElectionCell election={election} key={election.publicUrl} />
			))}
		</Grid>
	);
};

const ElectionCell = ({ election }) => (
	<GridCell span={4}>
		<ElectionCard to={'/elections/:publicUrl'} {...election} />
	</GridCell>
);

export default ElectionSelect;
