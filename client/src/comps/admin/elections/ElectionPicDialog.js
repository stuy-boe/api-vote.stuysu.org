import React from 'react';

import { createUseStyles } from 'react-jss';
import { SimpleDialog } from '@rmwc/dialog';
import '@rmwc/dialog/styles';

import { Button } from '@rmwc/button';
import ElectionPicList from './ElectionPicList';

import { Icon } from '@rmwc/icon';

import { useDropzone } from 'react-dropzone';

import FlexCenter from '../../utils/FlexCenter';
import Text from '../../../typography/Text';
import MessageQueue from '../../queues/MessageQueue';
import DialogQueue from '../../queues/DialogQueue';
import backend from '../../../tools/backend';

const useStyles = createUseStyles({
	ImageContainer: {
		maxHeight: '50vh',
		overflowY: 'auto',
		opacity: props => (props.isDragActive ? 0.6 : 1)
	},
	UploadContainer: {
		height: '6rem',
		borderRadius: '5px',
		border: '2px solid gray',
		marginBottom: '1rem',
		width: () =>
			window.innerWidth < 800 ? 'calc(100% - 32px)' : 'calc(100% - 48px)',
		paddingTop: '2rem',
		cursor: 'pointer'
	},
	UploadedPic: {
		width: '300px',
		height: '225px',
		objectFit: 'cover',
		borderRadius: '5px'
	},
	DialogTitle: {
		paddingLeft: '24px'
	}
});

const ElectionPicDialog = ({ setSelectedPic, selectedPic }) => {
	const [open, setOpen] = React.useState(false);
	const [activePic, setActivePic] = React.useState(selectedPic);
	const [uploadedPics, setUploadedPics] = React.useState([]);

	const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone(
		{
			// Disable click and keydown behavior
			noClick: true,
			noKeyboard: true,
			multiple: false,
			onDrop: async acceptedFiles => {
				const isImage = Boolean(acceptedFiles.length);

				if (isImage) {
					// do some stuff with the image
					const file = acceptedFiles[0];
					setOpen(false);

					const confirmUpload = await DialogQueue.confirm({
						title: (
							<b>Are you sure you want to upload this photo?</b>
						),
						body: (
							<FlexCenter>
								<img
									src={window.URL.createObjectURL(file)}
									alt={'Uploaded file'}
									className={classes.UploadedPic}
								/>
							</FlexCenter>
						),
						acceptLabel: 'CONFIRM'
					});

					if (confirmUpload) {
						const formData = new FormData();

						formData.append('image', file);

						try {
							MessageQueue.notify({
								body: 'Your image is now being uploaded...',
								timeout: 1000
							});

							const { data } = await backend.post(
								'/api/admin/elections/pics/upload',
								formData
							);
							const newPicUrl = data.payload.imageUrl;
							const newUploadedPics = [
								newPicUrl,
								...uploadedPics
							];
							setUploadedPics(newUploadedPics);

							MessageQueue.notify({
								body: 'Your image has been uploaded.',
								timeout: 2000
							});
						} catch (e) {
							if (e.response) {
								MessageQueue.notify({
									body: e.response.data.error.message
								});
							}
						}
					}

					setOpen(true);
				} else {
					MessageQueue.notify({
						body:
							'You are only allowed to upload individual image files.'
					});
				}
			},
			accept: 'image/*'
		}
	);

	const classes = useStyles({ isDragActive });

	return (
		<div>
			<SimpleDialog
				title={
					<span className={classes.DialogTitle}>
						Select An Election Picture
					</span>
				}
				open={open}
				{...getRootProps()}
				body={
					<div className={classes.ImageContainer}>
						<FlexCenter>
							<div
								onClick={() => inputRef.current.click()}
								className={classes.UploadContainer}
							>
								<FlexCenter>
									<input {...getInputProps()} type={'file'} />
									<Icon icon={'add_photo_alternate'} />
								</FlexCenter>
								<Text center>
									Click Here To Upload A New Image
								</Text>
							</div>
						</FlexCenter>
						<ElectionPicList
							setActivePic={setActivePic}
							activePic={activePic}
							uploadedPics={uploadedPics}
						/>
					</div>
				}
				onClose={evt => {
					if (
						evt.detail.action === 'accept' &&
						activePic !== selectedPic
					) {
						setSelectedPic(activePic);
					}
					setOpen(false);
				}}
				acceptLabel={'Select'}
			/>

			<Button outlined onClick={() => setOpen(true)} icon={'collections'}>
				Select Picture
			</Button>
		</div>
	);
};

export default ElectionPicDialog;
