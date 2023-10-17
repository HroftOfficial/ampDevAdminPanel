import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import classes from './newUserAmp.module.css';
import UserServicePortal from '../../../services/UserServicePortal';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import MainButton from '../../../components/MainButton/MainButton';
import StoreMessage from '../../../components/StoreMessage/StoreMessage';
import { AuthContext } from '../../../hoc/AuthProvider';
import { cities } from '../../../utils/only_cities2';

import { dataURLtoFile } from '../../../utils/cropImage';
import CropImageDialog from '../../../components/CropImageDialog/CropImageDialog';

const NewUserAmp = () => {
	const { store } = useContext(AuthContext);

	const [userPortal, setUserPortal] = useState({
		name: '',
		email: '',
		org: '',
		raiting: 3,
		legend: 'стабильное предприятие',
		html: '',
		inn: '',
		ogrn: '',
		info: '',
		description: '',
	});

	const handleChange = (e) => {
		setUserPortal((prev) => ({ ...prev, [e.target.name]: e.target?.value }));
	};

	const [state, setState] = useState([]);
	const [stateWork, setStateWork] = useState([]);
	const [toms, setToms] = useState([]);
	const [workGroup, setWorkGroup] = useState([]);

	const [isService, setIsService] = useState(false);

	const HandleService = (event) => {
		console.log(event.target?.checked);
		setIsService(event.target?.checked);
	};

	const handleChangeMech = (event) => {
		setState({
			...state,
			[event.target.name]: event.target?.checked,
		});
	};

	const handleChangeWork = (event) => {
		setStateWork({
			...stateWork,
			[event.target.name]: event.target?.checked,
		});
	};

	const [inputValue, setInputValue] = useState('');
	const [openImage, setOpenImage] = useState(false);
	const [newImage, setNewImage] = useState(null);

	let navigate = useNavigate();

	useEffect(() => {
		getHelpers();
	}, []);

	const handleCloseImage = () => {
		setOpenImage(false);
	};

	async function getHelpers() {
		try {
			store?.setMessage('');
			const responseToms = await UserServicePortal.getToms();
			setToms(responseToms?.data);
			const responseWg = await UserServicePortal.getWorkGroup();
			setWorkGroup(responseWg?.data);
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	}

	async function createUser(e) {
		try {
			e.preventDefault();
			store?.setMessage('');
			const resultState = Object.keys(state).filter(
				(key) => state[key] === true
			);
			const resultWork = Object.keys(stateWork).filter(
				(key) => stateWork[key] === true
			);
			const file = dataURLtoFile(newImage, 'logo.png');
			const f_data = new FormData();
			f_data.append('logo__img', file);
			f_data.append('name', userPortal?.name);
			f_data.append('email', userPortal?.email);
			f_data.append('org', userPortal?.org);
			f_data.append('raiting', userPortal?.raiting);
			f_data.append('legend', userPortal?.legend);
			f_data.append('html__href', userPortal?.html);
			f_data.append('inn', userPortal?.inn);
			f_data.append('ogrn', userPortal?.ogrn);
			f_data.append('information', userPortal?.info);
			f_data.append('description', userPortal?.description);
			f_data.append('service', isService);
			resultWork.forEach((item) => {
				f_data.append('user_access_level[]', item);
			});
			resultState.forEach((item) => {
				f_data.append('work_category[]', item);
			});
			f_data.append('cities', inputValue);

			const response = await UserServicePortal.createUserAmp(f_data);
			navigate('/usersPortals');
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	}

	const openWindow = async () => {
		setNewImage(null);
		setOpenImage(true);
	};

	const getCropImage = (cropImage) => {
		setNewImage(cropImage);
		handleCloseImage();
	};

	return (
		<>
			<CropImageDialog
				textDialog={'Выбирите логотип пользователя'}
				open={openImage}
				getCropImage={getCropImage}
				handleCloseImage={handleCloseImage}
			/>

			<div className={classes.newUser}>
				<h1 className={classes.newUserTitle}>Новый пользователь портала АМП</h1>
				<StoreMessage />
				<div className={classes.newUserPortalForm}>
					<div className={classes.newUserItemService}>
						<label htmlFor="service">
							<input
								type="checkbox"
								value={isService}
								onChange={HandleService}
								id="service"
								name="service"
							/>
							<span>Это служебный пользователь</span>
						</label>
						<span>пароль высылаться на почту не будет</span>
						{/* <FormControlLabel
                      control={
                        <Checkbox
                        onChange={handleChange}
                        name="service"
                        value={userPortal?.service}
                      />
                      }
                      label="Это служебный пользователь"
                    />
                    <span>пароль высылаться на почту не будет</span> */}
					</div>
				</div>
				<div className={classes.newUserPortalForm}>
					<div className={classes.newUserItem}>
						<label>ФИО</label>
						<input
							type="text"
							placeholder="Иванов И.И."
							name="name"
							required
							onChange={handleChange}
							value={userPortal?.name}
						/>
					</div>
					<div className={classes.newUserItem}>
						<label>Email</label>
						<input
							type="email"
							placeholder="john@gmail.com"
							name="email"
							required
							onChange={handleChange}
							value={userPortal?.email}
						/>
					</div>
					<div className={classes.newUserItem}>
						<label>Название организации</label>
						<input
							type="text"
							placeholder="ООО Хорошее дело"
							name="org"
							required
							onChange={handleChange}
							value={userPortal?.org}
						/>
					</div>
					<div className={classes.newUserItem}>
						<label>Рейтинг АМП</label>
						<input
							type="number"
							name="raiting"
							required
							min={1}
							max={5}
							onChange={handleChange}
							value={userPortal?.raiting}
						/>
					</div>
					<div className={classes.newUserItem}>
						<label>Легенда рейтинга АМП</label>
						<input
							type="text"
							name="legend"
							required
							onChange={handleChange}
							value={userPortal?.legend}
						/>
					</div>
					<div className={classes.newUserItem}>
						<label>Сcылка на сайт организации</label>
						<input
							type="text"
							name="html"
							placeholder="http://somesite.com"
							onChange={handleChange}
							value={userPortal?.html}
						/>
					</div>
					<div className={classes.newUserItem}>
						<label>ИНН</label>
						<input
							type="number"
							name="inn"
							onChange={handleChange}
							value={userPortal?.inn}
						/>
					</div>
					<div className={classes.newUserItem}>
						<label>ОГРН</label>
						<input
							type="number"
							name="ogrn"
							onChange={handleChange}
							value={userPortal?.ogrn}
						/>
					</div>
					<div className={classes.newUserItem}>
						<InputLabel id="info">Инормация о организации</InputLabel>
						<TextareaAutosize
							aria-label="info"
							name="info"
							minRows={3}
							onChange={handleChange}
							value={userPortal?.info}
						/>
					</div>
					<div className={classes.newUserItem}>
						<InputLabel id="info">Описание организации</InputLabel>
						<TextareaAutosize
							aria-label="description"
							name="description"
							minRows={3}
							onChange={handleChange}
							value={userPortal?.description}
						/>
					</div>
					<div className={classes.newUserItem}>
						<InputLabel id="info">Населенный пункт</InputLabel>
						<Autocomplete
							id="cities"
							name="cities"
							inputValue={inputValue}
							onInputChange={(event, newInputValue) => {
								setInputValue(newInputValue);
							}}
							options={cities}
							autoHighlight
							getOptionLabel={(option) => option.value}
							renderOption={(props, option) => (
								<Box component="li" {...props}>
									{option.value}
								</Box>
							)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Выберите город"
									inputProps={{
										...params.inputProps,
										autoComplete: 'new-cities', // disable autocomplete and autofill
									}}
								/>
							)}
						/>
					</div>

					<div className={classes.newUserItem}>
						<InputLabel>Фото</InputLabel>
						{newImage && <img src={newImage} alt="logo" />}
						<Button
							variant="contained"
							component="span"
							className={classes.imageButton}
							onClick={(e) => openWindow()}
						>
							Загрузить логотип
						</Button>
						{/* </label>  */}
					</div>
				</div>
				<div className={classes.legendToms}>Группа доступа</div>
				<div className={classes.workGroupArea}>
					{workGroup.map((t) => (
						<>
							<div>
								<FormControlLabel
									control={
										<Checkbox
											onChange={handleChangeWork}
											name={t?.access_level}
											key={t?.access_level}
										/>
									}
									label={t?.name}
								/>
							</div>
						</>
					))}
				</div>
				<div style={{ paddingTop: '20px' }}>
					<hr />
				</div>
				<div className={classes.tomsAreaForm}>
					<div className={classes.legendToms}>Виды мех обработки</div>
					{toms.map((t) => (
						<>
							<div className={classes.legendToms}>{t?.name_key}</div>
							<div className={classes.tomsArea}>
								{t?.items.map((cb) => (
									<div className={classes.tomsLabel}>
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleChangeMech}
													name={cb?.id_name}
													key={cb?.id_name}
												/>
											}
											label={cb?.name}
										/>
									</div>
								))}
							</div>
						</>
					))}
				</div>
				<div className={classes.newUserItem}>
					<MainButton handleClick={(e) => createUser(e)} title={'Создать'} />
				</div>
			</div>
		</>
	);
};

export default observer(NewUserAmp);
