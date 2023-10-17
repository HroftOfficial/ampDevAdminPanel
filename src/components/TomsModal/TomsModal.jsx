import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FormLabel from '@mui/material/FormLabel';
import { TomsList } from './TomsList';

const wrapper = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 3,
	backgroundColor: 'white',
	width: '85%',
	height: '85%',
	borderRadius: 3,
	padding: 4,
	overflowY: 'scroll',
};

export const TomsModal = ({ open, setOpen, data, selected, setSelected }) => {
	const handleClose = () => setOpen(false);
	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={wrapper}>
					<FormLabel
						id="controlled-radio-buttons-group"
						style={{
							color: 'black',
							fontWeight: 700,
							fontSize: '1.4rem',
							padding: '30px 0px 5px 0px',
						}}
					>
						Виды механической обработки:
					</FormLabel>
					<Box
						sx={{
							columnCount: 3,
							textAlign: 'left',
						}}
					>
						{data?.map((group) => (
							<Box key={group._id}>
								<h3>{group.name_key}</h3>{' '}
								<TomsList
									group={group}
									selected={selected}
									setSelected={setSelected}
								/>
							</Box>
						))}
					</Box>
					<Button
						onClick={handleClose}
						type="button"
						variant="contained"
						size="large"
					>
						Готово
					</Button>
				</Box>
			</Modal>
		</>
	);
};
