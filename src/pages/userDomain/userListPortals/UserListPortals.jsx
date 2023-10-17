// import "./userListPortals.css";
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserServicePortal from '../../../services/UserServicePortal';
import { AuthContext } from '../../../hoc/AuthProvider';
import { observer } from 'mobx-react-lite';
import logo from './img/no-logo.png';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import renderCellExpand from '../../../components/GridCellExpand/GridCellExpand';
import { cities } from '../../../utils/only_cities2';
import config from '../../../settings/config';
import EditButton from '../../../components/CustomButton/EditButton';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import ChangeImageButton from '../../../components/CustomButton/ChangeImageButton';
import ChangeButton from '../../../components/CustomButton/ChangeButton';
import { PinkSwitch, BlueSwitch, GreenSwitch } from '../../../settings/some';
import CircleButton from '../../../components/CustomButton/CircleButton';
import StoreMessage from '../../../components/StoreMessage/StoreMessage';

import { dataURLtoFile } from '../../../utils/cropImage';
import CropImageDialog from '../../../components/CropImageDialog/CropImageDialog';

import classes from './userListPortals.module.css';

const UserListAmp = () => {
	const { store } = useContext(AuthContext);
	const label = { inputProps: { 'aria-label': 'users active' } };
	const label2 = { inputProps: { 'aria-label': 'users deleted' } };
	const label3 = { inputProps: { 'aria-label': 'users service' } };
	const [users, setUsers] = useState([]);

	const [open, setOpen] = React.useState(false);
	const [openCities, setOpenCities] = useState(false);

	const [selectCity, setSelectCity] = useState(null);
	const [openImage, setOpenImage] = useState(false);

	const [currentEmail, setCurrentEmail] = useState('');
	const [currentOrg, setCurrentOrg] = useState('');
	const [currentId, setCurrentId] = useState('');
	const [currentCities, setCurrentCities] = useState('');

	const navigate = useNavigate();

	/**
	 * main
	 */
	const handleChangeEnabled = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await UserServicePortal.stateUserPortal(id, checkedValue);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	const handleDelete = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await UserServicePortal.deleteUserPortal(id, checkedValue);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	const handleService = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await UserServicePortal.serviceUserPortal(id, checkedValue);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	/**
	 * end main
	 */

	const handleClose = () => {
		setOpen(false);
	};

	const handleCloseCities = () => {
		setOpenCities(false);
	};

	const handleCloseImage = () => {
		setOpenImage(false);
	};

	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		try {
			store?.setMessage('');
			store.setLoading(true);
			const response = await UserServicePortal.fetchUsers();
			// console.log(response);
			setUsers(response?.data);
			store.setLoading(false);
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store.setLoading(false);
		}
	}

	async function prepareChangePassword(id, email, org) {
		setCurrentEmail(email);
		setCurrentOrg(org);
		setCurrentId(id);
		setOpen(true);
	}

	async function prepareCitiesChange(id, org, cities) {
		setCurrentId(id);
		setCurrentOrg(org);
		setCurrentCities(cities);
		setSelectCity(null);
		setOpenCities(true);
	}

	async function prepareImgChange(id, org) {
		setCurrentId(id);
		setCurrentOrg(org);
		setOpenImage(true);
	}

	async function changePassword() {
		try {
			store?.setMessage('');
			const response = await UserServicePortal.changePassword(
				currentId,
				currentEmail
			);
			setOpen(false);
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			setOpen(false);
		}
	}

	async function handleChangeCities() {
		try {
			const id = currentId;
			const cities = selectCity?.value;
			store?.setMessage('');
			store?.setLoading(true);
			const response = await UserServicePortal.changeCities(id, cities);
			store?.setLoading(false);
			setOpenCities(false);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store?.setLoading(false);
		}
	}

	async function changeImage(cropImage) {
		try {
			const id = currentId;
			store?.setMessage('');
			// const file = dataURLtoFile(newImage, "logo.png");
			const file = dataURLtoFile(cropImage, 'logo.png');
			store?.setLoading(true);
			const data = new FormData();
			data.append('logo__img', file);
			const response = await UserServicePortal.changeImage(id, data);
			store?.setLoading(false);
			setOpenImage(false);
			getUsers();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store?.setLoading(false);
		}
	}

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
							onChange={(event) => handleDelete(event, params.row._id)}
						/>
					</div>
				);
			},
		},
		{
			field: 'enabled',
			headerName: 'Активность',
			type: 'boolean',
			with: 150,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="styleButton">
						<GreenSwitch
							{...label}
							checked={params?.row?.enabled}
							onChange={(event) => handleChangeEnabled(event, params.row._id)}
						/>
					</div>
				);
			},
		},
		{
			field: 'service',
			headerName: 'Служебный',
			type: 'boolean',
			with: 150,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="styleButton">
						<BlueSwitch
							{...label3}
							checked={params?.row?.service}
							onChange={(event) => handleService(event, params.row._id)}
						/>
					</div>
				);
			},
		},
		{
			field: 'org',
			headerName: 'Организация',
			width: 180,
			editable: false,
			renderCell: renderCellExpand,
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 200,
			editable: false,
		},
		{
			field: 'name',
			headerName: 'ФИО',
			width: 100,
			editable: false,
			renderCell: renderCellExpand,
		},
		{
			field: 'cities',
			headerName: 'Город',
			width: 220,
			editable: false,
			headerAlign: 'center',
			disableColumnMenu: true,
			renderCell: (params) => {
				return (
					<div className="editCell">
						<div>{params?.value}</div>
						<div>
							<EditButton
								handleClick={() =>
									prepareCitiesChange(
										params?.row._id,
										params?.row.org,
										params?.row.cities
									)
								}
							/>
						</div>
					</div>
				);
			},
		},
		{
			field: 'logo__img',
			headerName: 'Изображение',
			width: 170,
			disableColumnMenu: true,
			sortable: false,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className="editCell">
						{params?.value[0] ? (
							<img
								src={params.value[0]?.path?.replace(
									/public/i,
									config?.UPLOAD_API_URL
								)}
								alt="logo"
								style={{ width: '60px' }}
							/>
						) : (
							<img src={`${logo}`} alt="logo t" style={{ width: '45px' }} />
						)}
						<div>
							<ChangeImageButton
								handleClick={() =>
									prepareImgChange(params.row._id, params?.row?.org)
								}
							/>
						</div>
					</div>
				);
			},
		},
		{
			field: 'action',
			headerName: 'Редактировать',
			width: 120,
			disableColumnMenu: true,
			sortable: false,
			renderCell: (params) => {
				return <EditButton link={'/usersPortals/' + params?.row._id} />;
			},
		},
		{
			field: 'action3',
			headerName: 'Пароль',
			width: 90,
			disableColumnMenu: true,
			sortable: false,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<ChangeButton
						handleClick={() =>
							prepareChangePassword(
								params?.row._id,
								params?.row.email,
								params?.row.org
							)
						}
					/>
				);
			},
		},
	]);

	const getCropImage = async (cropImage) => {
		handleCloseImage();
		await changeImage(cropImage);
	};

	return (
		<>
			<Dialog open={openCities} onClose={handleCloseCities}>
				<DialogTitle>Изменение населенного пункта</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Вы собираетесь изменить населенный пункт{' '}
						<span className="citiesInfoTitle">{currentCities}</span> для
						организации <span className="citiesInfoTitle">{currentOrg}</span>
					</DialogContentText>
					<div className="newUserItem">
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
							getOptionLabel={(option) => option.value}
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

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					{`Вы собираетесь сменить пароль пользователя ${currentOrg}`}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Новый пароль будет сгенерирован и отправлен на почту {currentEmail}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						Отменить
					</Button>
					<Button onClick={changePassword}>Сменить пароль</Button>
				</DialogActions>
			</Dialog>

			<CropImageDialog
				textDialog={'Выберите логотип'}
				open={openImage}
				getCropImage={getCropImage}
				handleCloseImage={handleCloseImage}
			/>

			<div className={classes.userList}>
				<h1 className={classes.newUserTitle}>Пользователи портала</h1>
				<StoreMessage />
				<CircleButton link={'/usersPortals/newUsersPortals'} />

				<CustomDataGrid
					rows={users}
					columns={columns}
					getRowClassName={(params) =>
						`super-user-amp-theme--${params?.row?.deleted}`
					}
				/>
				<Button
					sx={{
						color: '#00AEAE',
						marginBottom: '5px',
						border: '1px solid #00AEAE',
						'&.MuiButton-root:hover': {
							border: '1px solid #00AEAE',
						},
					}}
					startIcon={
						<LowPriorityIcon
							style={{ color: 'teal', cursor: 'pointer', fontSize: '40px' }}
						/>
					}
					onClick={() => navigate('/usersPortals/sortUser')}
				>
					Сортировка
				</Button>
			</div>
		</>
	);
};

export default observer(UserListAmp);
