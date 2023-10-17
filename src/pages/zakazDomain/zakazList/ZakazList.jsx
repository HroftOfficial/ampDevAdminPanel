import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../hoc/AuthProvider';
import './zakazList.css';
import ZakazService from '../../../services/ZakazService';
import { observer } from 'mobx-react-lite';
import renderCellExpand from '../../../components/GridCellExpand/GridCellExpand';
import EditButton from '../../../components/CustomButton/EditButton';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { PinkSwitch, GreenSwitch } from '../../../settings/some';
import CircleButton from '../../../components/CustomButton/CircleButton';
import StoreMessage from '../../../components/StoreMessage/StoreMessage';
import { Button } from '@mui/material';
import HistoryDialog from '../../../components/Dialog/HistoryDialog';
import { format } from 'date-fns';

const ZakazList = () => {
	const { store } = useContext(AuthContext);

	const label = { inputProps: { 'aria-label': 'zakaz active' } };
	const label2 = { inputProps: { 'aria-label': 'zakaz deleted' } };

	const [zakazes, setZakazes] = useState([]);
	const [history, setHistory] = useState([]);

	const [open, setOpen] = React.useState(false);

	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		try {
			store?.setMessage('');
			store?.setLoading(true);
			const response = await ZakazService.fetchZakazes();
			// console.log('fetch zakazes', response?.data)
			setZakazes(response?.data);
			store?.setLoading(false);
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store?.setLoading(false);
		}
	}

	const handleDelete = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await ZakazService.deleteZakaz(id, checkedValue);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	const handleChangeEnabled = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await ZakazService.stateZakaz(id, checkedValue);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	async function getHistory(id) {
		try {
			store?.setMessage('');
			store?.setLoading(true);
			const response = await ZakazService.getHistory(id);
			setHistory(
				response?.data?.history?.sort((a, b) => (a._id > b._id ? -1 : 1))
			);
			store?.setLoading(false);
		} catch (error) {
			console.error(error);
		} finally {
			store?.setLoading(false);
		}
	}

	const PrepareHistoryDialog = async (id) => {
		// console.log('prepare history dialog',id );
		const history = await getHistory(id);
		setOpen(true);
	};

	const columns = useMemo(() => [
		{
			field: 'deleted',
			headerName: 'Удален',
			type: 'boolean',
			with: 120,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="styleButton">
						<PinkSwitch
							{...label2}
							checked={params?.row?.deleted}
							onChange={(event) => handleDelete(event, params?.row?._id)}
						/>
					</div>
				);
			},
		},
		{
			field: 'enabled',
			headerName: 'Активность',
			type: 'boolean',
			with: 120,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="styleButton">
						<GreenSwitch
							{...label}
							checked={params?.row?.enabled}
							onChange={(event) => handleChangeEnabled(event, params?.row?._id)}
						/>
					</div>
				);
			},
		},
		{
			field: 'inhere_user_name',
			headerName: 'Владелец',
			width: 250,
			editable: false,
		},
		{
			field: 'number',
			headerName: 'Номер',
			width: 90,
			editable: false,
		},
		{
			field: 'title',
			headerName: 'Название',
			width: 220,
			editable: false,
			renderCell: renderCellExpand,
		},
		{
			field: 'cities',
			headerName: 'Город',
			width: 100,
			editable: false,
			renderCell: renderCellExpand,
		},
		{
			field: 'action',
			headerName: 'Редакт.',
			width: 80,
			disableColumnMenu: true,
			sortable: false,
			renderCell: (params) => {
				return (
					<div className="allEditCell">
						<Link
							to={'/zakazes/edit/' + params?.row?._id}
							style={{
								display: 'flex',
								width: '100%',
								justifyContent: 'center',
							}}
						>
							<EditButton />
						</Link>
					</div>
				);
			},
		},
		{
			field: 'date',
			headerName: 'Дата',
			width: 100,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return format(new Date(params?.value), 'dd.MM.yyyy');
			},
		},
		{
			field: 'action2',
			headerName: 'История',
			width: 150,
			disableColumnMenu: true,
			sortable: false,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div
						style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
					>
						<Button
							color="primary"
							variant="contained"
							onClick={() => PrepareHistoryDialog(params?.row?._id)}
						>
							История
						</Button>
					</div>
				);
			},
		},
	]);

	return (
		<>
			<HistoryDialog open={open} handleClose={handleClose} data={history} />
			<div className="userList">
				<h1 className="newUserTitle">Заказы</h1>
				<StoreMessage />
				<CircleButton link={'/zakazes/new'} />
				<CustomDataGrid
					rows={zakazes}
					columns={columns}
					getRowClassName={(params) =>
						`super-zakaz-theme--${params?.row?.deleted}`
					}
				/>
			</div>
		</>
	);
};

export default observer(ZakazList);
