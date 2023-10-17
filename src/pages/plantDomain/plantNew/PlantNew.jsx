import React, { useState, useEffect, useContext } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContentText,
	Autocomplete,
	Button,
	DialogActions,
	DialogContent,
	TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PlantNewService from '../../../services/PlantNewService';
import { AuthContext } from '../../../hoc/AuthProvider';
import { observer } from 'mobx-react-lite';
import config from '../../../settings/config';
import EditButton from '../../../components/CustomButton/EditButton';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { PinkSwitch, BlueSwitch, GreenSwitch } from '../../../settings/some';
import CircleButton from '../../../components/CustomButton/CircleButton';
import StoreMessage from '../../../components/StoreMessage/StoreMessage';
import renderCellExpand from '../../../components/GridCellExpand/GridCellExpand';
import HistoryDialog from '../../../components/Dialog/HistoryDialog';
import { cities } from '../../../utils/cities-name';

import classes from './PlantNew.module.css';

const PlantNew = () => {
	const { store } = useContext(AuthContext);

	const label = { inputProps: { 'aria-label': 'plant active' } };
	const label2 = { inputProps: { 'aria-label': 'plant deleted' } };
	const label3 = { inputProps: { 'aria-label': 'plants new' } };
	const [plant, setPlant] = useState([]);
	const [history, setHistory] = useState([]);

	const [message, setMessage] = useState('');
	const [open, setOpen] = useState(false);
	const [openCities, setOpenCities] = useState(false);
	const [selectCity, setSelectCity] = useState(null);
	const [currentPlant, setCurrentPlant] = useState('');
	const [currentId, setCurrentId] = useState('');
	const [currentCities, setCurrentCities] = useState('');

	async function prepareCitiesChange(id, plant, cities) {
		setCurrentId(id);
		setCurrentPlant(plant);
		setCurrentCities(cities);
		setSelectCity(null);
		setOpenCities(true);
	}

	useEffect(() => {
		getPlants();
	}, []);

	async function getPlants() {
		try {
			setMessage('');
			store.setLoading(true);
			const response = await PlantNewService.fetchPlants();
			const reverseData = response?.data.reverse();
			setPlant(reverseData);
			store?.setLoading(false);
		} catch (error) {
			setMessage(error?.response?.data?.message);
		} finally {
			store.setLoading(false);
		}
	}

	const handleEnable = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await PlantNewService.enabledPlant(id, checkedValue);
			getPlants();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	const handleDelete = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await PlantNewService.deletedPlant(id, checkedValue);
			getPlants();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	async function handleChangeCities() {
		try {
			const id = currentId;
			const cities = selectCity?.name;
			store?.setMessage('');
			store?.setLoading(true);
			const response = await PlantNewService.changeCities(id, cities);
			store?.setLoading(false);
			setOpenCities(false);
			getPlants();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store?.setLoading(false);
		}
	}

	async function getHistory(id) {
		try {
			store?.setMessage('');
			store?.setLoading(true);
			const response = await PlantNewService.getHistory(id);
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

	const handleCloseCities = () => {
		setOpenCities(false);
	};

	const PrepareHistoryDialog = async (id) => {
		const history = await getHistory(id);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const columns = [
		{
			field: 'deleted',
			headerName: 'Удалено',
			type: 'boolean',
			with: 100,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className={classes.styleButton}>
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
			with: 100,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className={classes.styleButton}>
						<GreenSwitch
							{...label}
							checked={params?.row?.enabled}
							onChange={(event) => handleEnable(event, params?.row?._id)}
						/>
					</div>
				);
			},
		},
		{
			field: 'name',
			headerName: 'Название',
			width: 150,
			editable: false,
			renderCell: renderCellExpand,
		},
		{
			field: 'inhereUser',
			headerName: 'Владелец',
			width: 150,
			editable: false,
			valueGetter: (params) => params?.row?.inhereUser?.inhereUserName,
			renderCell: renderCellExpand,
		},
		{
			field: 'sortNumber',
			headerName: 'Номер сорт.',
			width: 70,
			editable: false,
		},

		{
			field: 'mainName',
			headerName: 'Группа оборудования',
			width: 150,
			editable: false,
			// valueGetter: (params) => params?.row?.out[0]?.name,
			type: 'string',
		},
		{
			field: 'newPlant',
			headerName: 'Новое',
			type: 'boolean',
			with: 70,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
		},
		{
			field: 'cities',
			headerName: 'Город',
			width: 150,
			editable: false,
			headerAlign: 'center',
			disableColumnMenu: true,
			renderCell: (params) => {
				return (
					<div className={classes.editCell}>
						<div>{params?.value}</div>
						<div>
							<EditButton
								handleClick={() =>
									prepareCitiesChange(
										params?.row?._id,
										params?.row?.name,
										params?.row?.cities
									)
								}
							/>
						</div>
					</div>
				);
			},
		},
		// {
		// 	field: 'info',
		// 	headerName: 'Описание',
		// 	width: 150,
		// 	editable: false,
		// 	renderCell: renderCellExpand,
		// },

		{
			field: 'action',
			headerName: 'Редактировать',
			width: 150,
			headerAlign: 'center',
			align: 'center',
			cellClassName: 'actionStyle',
			disableColumnMenu: true,
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link
							to={'/plantNew/' + params.row._id}
							style={{
								display: 'flex',
								width: '100%',
								justifyContent: 'center',
							}}
						>
							<EditButton />
						</Link>
					</>
				);
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
	];

	return (
		<>
			<HistoryDialog open={open} handleClose={handleClose} data={history} />
			<Dialog open={openCities} onClose={handleCloseCities}>
				<DialogTitle>Изменение населенного пункта</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Вы собираетесь изменить населенный пункт{' '}
						<span className={classes.citiesInfoTitle}>{currentCities}</span> для
						оборудования{' '}
						<span className={classes.citiesInfoTitle}>{currentPlant}</span>
					</DialogContentText>
					<div className={classes.newUserItem}>
						<Autocomplete
							id="nba teams"
							options={cities}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Выберите город"
									variant="outlined"
								/>
							)}
							getOptionLabel={(option) => option.name}
							style={{ width: 270 }}
							value={selectCity}
							onChange={(_event, newCity) => {
								setSelectCity(newCity);
							}}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseCities}>Отмена</Button>
					<Button onClick={handleChangeCities}>Сохранить</Button>
				</DialogActions>
			</Dialog>

			<div className={classes.userList}>
				<h1 className={classes.newUserTitle}>Оборудование</h1>
				<StoreMessage />
				<CircleButton link={'/plantNew/addPlant'} />
				<CustomDataGrid rows={plant} columns={columns} />
			</div>
		</>
	);
};

export default observer(PlantNew);
