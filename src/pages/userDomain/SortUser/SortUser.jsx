import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserServicePortal from '../../../services/UserServicePortal';
import { AuthContext } from '../../../hoc/AuthProvider';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import renderCellExpand from '../../../components/GridCellExpand/GridCellExpand';
import EditButton from '../../../components/CustomButton/EditButton';
import { SortedUsersDialog } from '../../../components/Dialog/SortedUsersDialog';

import classes from './SortUser.module.css';
import { Button } from '@mui/material';

export const SortUser = () => {
	const { store } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	const [open, setOpen] = useState(false);
	const [currentId, setCurrentId] = useState('');
	const [currentOrg, setCurrentOrg] = useState('');
	const [sortOldNumber, setSortOldNumber] = useState(10000);
	const [sortNumber, setSortNumber] = useState(10000);

	const navigate = useNavigate();

	async function prepareSortChange(id, org, sort) {
		setCurrentId(id);
		setCurrentOrg(org);
		setSortNumber(sort);
		setSortOldNumber(sort);
		setOpen(true);
	}

	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		try {
			store?.setMessage('');
			store.setLoading(true);
			const response = await UserServicePortal.fetchUsers();
			const arrPartners = response?.data.filter(
				(el) => el.deleted === false && el.service === false
			);
			setUsers(arrPartners);
			store.setLoading(false);
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store.setLoading(false);
		}
	}

	const changeSortNumber = async () => {
		try {
			const id = currentId;
			store?.setMessage('');
			const formData = new FormData();
			formData.append('extended_sorting', sortNumber);

			const response = await UserServicePortal.changeSortNumber(id, formData);
			console.log(response);
			setOpen(false);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			setOpen(false);
		}
	};

	const columns = [
		{
			field: 'org',
			headerName: 'Организация',
			width: 250,
			editable: false,
			renderCell: renderCellExpand,
		},
		{
			field: 'name',
			headerName: 'ФИО',
			width: 250,
			editable: false,
			renderCell: renderCellExpand,
		},
		{
			field: 'extended_sorting',
			headerName: 'Приоритет сортировки',
			width: 250,
			editable: false,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="editCell">
						<div>{params?.value}</div>
						<div>
							<EditButton
								handleClick={() =>
									prepareSortChange(
										params?.row._id,
										params?.row.org,
										params?.row.extended_sorting
									)
								}
							/>
						</div>
					</div>
				);
			},
		},
	];

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<SortedUsersDialog
				open={open}
				handleClose={handleClose}
				currentSort={sortNumber}
				setSortNumber={setSortNumber}
				currentOrg={currentOrg}
				handleSubmit={changeSortNumber}
				sortOldNumber={sortOldNumber}
			/>
			<div className={classes.userList}>
				<h1 className={classes.newUserTitle}>Приоритет сортировки</h1>
				<Button
					variant="outlined"
					onClick={() => navigate(-1)}
					sx={{ margin: '10px 0' }}
				>
					Назад
				</Button>
				<CustomDataGrid rows={users} columns={columns} />
			</div>
		</>
	);
};
