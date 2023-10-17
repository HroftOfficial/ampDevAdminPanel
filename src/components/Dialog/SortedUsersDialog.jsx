import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export const SortedUsersDialog = ({
	open,
	handleClose,
	currentSort,
	currentOrg,
	handleSubmit,
	setSortNumber,
	sortOldNumber,
}) => {
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Изменение населенного пункта</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Вы собираетесь изменить порядок сортировки
					<span className="citiesInfoTitle">{sortOldNumber}</span> для
					организации <span className="citiesInfoTitle">{currentOrg}</span>
					<br />
					<strong>
						Чем ниже показатель тем ближе пользователь к началу списка!
					</strong>
				</DialogContentText>
				<div className="newUserItem">
					<input
						type="number"
						value={currentSort}
						onChange={(e) => setSortNumber(e.target.value)}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Отмена</Button>
				<Button onClick={handleSubmit}>Сохранить</Button>
			</DialogActions>
		</Dialog>
	);
};
