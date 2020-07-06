import { Grid, GridCell } from '@rmwc/grid';
import React from 'react';

import urlJoin from 'url-join';
import { API_URL } from '../../../constants';
import { createUseStyles } from 'react-jss';

import useApi from '../../../tools/useApi';
import Loading from '../../utils/Loading';

const useStyles = createUseStyles({
	ImageCell: {
		marginBottom: '10px',
		borderRadius: '5px',
		overflow: 'hidden',
		cursor: 'pointer'
	},
	ImageGrid: { width: '50rem', maxWidth: '100%' },
	Image: { width: '100%' },
	SelectedImage: {
		border: 'solid 0.5rem #1abc9c',
		width: 'calc( 100% - 1rem )'
	}
});

const ElectionPicList = ({ activePic, setActivePic, uploadedPics }) => {
	const classes = useStyles();
	const { data: electionPics } = useApi('/api/admin/elections/pics');

	if (electionPics === null) {
		return <Loading />;
	}

	const completePicsList = [...uploadedPics, ...electionPics];
	return (
		<Grid className={classes.ImageGrid}>
			{completePicsList.map(src => {
				const absoluteSrc = urlJoin(
					API_URL,
					`/api/s3`,
					src,
					`?width=300`,
					`?height=225`,
					`?crop=fill`,
					`?flags=lossy`,
					`?quality=95`
				);

				const isSelected = activePic === src;
				const imageClass = isSelected
					? classes.SelectedImage
					: classes.Image;

				return (
					<GridCell
						onClick={() => setActivePic(src)}
						key={src}
						className={classes.ImageCell}
						span={6}
					>
						<img
							src={absoluteSrc}
							alt={'Possible selection'}
							className={imageClass}
						/>
					</GridCell>
				);
			})}
		</Grid>
	);
};

export default ElectionPicList;
