import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantGroupNewService from '../../../../services/PlantGroupNewService';
import PlantMainGroupService from '../../../../services/PlantMainGroupService';
import PlantNewService from '../../../../services/PlantNewService';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import OwnerForm from '../../../../components/OwnerForm/OwnerForm';
import FilesUploadMulti from '../../../../components/FilesUploadMulti/FilesUploadMulti';
import allowedFiles from '../../../../utils/allowedFiles';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { CheckFilesQuantity } from '../../../../components/FilesUploadMulti/CheckFilesQuantity/CheckFilesQuantity';
import { cities } from '../../../../utils/cities-name';

import classes from './AddPlant.module.css';

const AddPlantNew = () => {
	const [plant, setPlant] = useState({
		mainGroup: '',
		plantGroup: '',
		name: '',
		sortNumber: 10,
		newPlant: false,
		enabled: true,
		price: '',
		info: '',
	});

	const [plantGroup, setPlantGroup] = useState([]); //массив подгрупп оборудования
	const [mainGroup, setMainGroup] = useState([]); //массив основных групп

	const [message, setMessage] = useState('');
	const [inputValue, setInputValue] = useState(''); //выбранный город
	///files
	const plantPhoto = []; //заглушка для фото
	const plantFiles = []; //заглушка для файлов
	const [selectIndex, setSelectIndex] = useState(0); // индекс фото для превью
	const [pfiles, setPfiles] = useState([]); //photo add draft
	const [files, setFiles] = useState([]); //files add draft
	const [ownerInfo, setOwnerInfo] = useState(null); //выбранный владелец

	const [isCheckFiles, setIsCheckFiles] = useState({
		needPhoto: false,
		manyPhoto: false,
		manyFiles: false,
	}); // проверка количества файлов и фото
	///files

	const navigate = useNavigate();

	useEffect(() => {
		getPlantGroup();
	}, []);

	const handleChange = (e) => {
		setPlant((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	async function getPlantGroup() {
		try {
			const response = await PlantGroupNewService.fetchPlantsGroup();
			const mainGroup = await PlantMainGroupService.fetchPlantsMainGroup();
			setMainGroup(mainGroup?.data);
			setPlantGroup(response?.data);
		} catch (error) {
			setMessage(error?.response?.data?.message);
			console.error(error?.response?.data?.message);
		}
	}

	async function createPlant(e) {
		try {
			e.preventDefault();
			if (!ownerInfo) {
				setMessage('Выберите владельца!');
				return null;
			}
			if (pfiles?.length < 1) {
				setIsCheckFiles({ ...isCheckFiles, needPhoto: true });
				return;
			}

			if (pfiles?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyPhoto: true });
				return;
			}
			if (files?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyFiles: true });
				return;
			}
			setIsCheckFiles({ needPhoto: false, manyPhoto: false, manyFiles: false });
			setMessage('');
			const f_data = new FormData();
			Object.values(pfiles).forEach((item) => {
				f_data.append('photo_plant', item);
			});
			Object.values(files).forEach((item) => {
				f_data.append('file_plant', item);
			});

			f_data.append('index_photo', selectIndex);
			f_data.append('name', plant.name);
			f_data.append('plantGroup', plant.plantGroup);
			// f_data.append('sortNumber', plant.sortNumber);
			f_data.append('enabled', plant.enabled);
			f_data.append('newPlant', plant.newPlant);
			f_data.append('price', plant.price);
			f_data.append('info', plant.info);
			f_data.append('cities', inputValue);
			f_data.append('inhere_user', ownerInfo.id);
			f_data.append('inhere_user_name', ownerInfo.name);
			await PlantNewService.createPlantWitchFile(f_data);
			navigate('/plantNew');
		} catch (error) {
			setMessage(error?.response?.data?.message);
			console.error(error?.response?.data?.message);
		}
	}

	return (
		<>
			<div className={classes.wrapper}>
				<h2>Добавить оборудование</h2>
				<form className={classes.form} onSubmit={createPlant}>
					<div className={classes.topForm}>
						<FormControl sx={{ width: '25%' }}>
							<InputLabel id="mainGroup">
								Основная группа оборудования
							</InputLabel>
							<Select
								labelId="mainGroup"
								id="mainGroup"
								name="mainGroup"
								value={plant.mainGroup}
								label="mainGroup"
								onChange={handleChange}
							>
								{mainGroup?.map((item) => (
									<MenuItem key={item?._id} value={item?._id}>
										{item?.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ width: '25%' }}>
							<InputLabel id="plantGroup">Группа оборудования</InputLabel>
							<Select
								labelId="plantGroup"
								id="plantGroup"
								name="plantGroup"
								value={plant.plantGroup}
								label="plantGroup"
								onChange={handleChange}
								required
							>
								{plantGroup
									?.filter((item) => item.mainId[0] === plant.mainGroup)
									.map((item) => (
										<MenuItem key={item?._id} value={item?._id}>
											{item?.name}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						<TextField
							id="name"
							name="name"
							sx={{ width: '45%' }}
							label="Название оборудования"
							variant="outlined"
							onChange={handleChange}
							required
							value={plant.name}
						/>
						{/* <TextField
							id="sortNumber"
							variant="outlined"
							label="Номер для сортировки"
							name="sortNumber"
							onChange={handleChange}
							value={plant.sortNumber}
							type="number"
						/> */}

						<FormControl sx={{ width: '100px' }}>
							<InputLabel id="newPlant">Новое</InputLabel>
							<Select
								labelId="newPlant"
								id="newPlant"
								name="newPlant"
								label="Новое?"
								value={plant.newPlant}
								onChange={handleChange}
							>
								<MenuItem value="false">Нет</MenuItem>
								<MenuItem value="true">Да</MenuItem>
							</Select>
						</FormControl>

						<TextField
							id="price"
							name="price"
							variant="outlined"
							label="Стоимость"
							onChange={handleChange}
							required
							value={plant.price}
						/>
						<FormControl sx={{ width: '200px' }}>
							<Autocomplete
								id="cities"
								name="cities"
								inputValue={inputValue}
								onInputChange={(event, newInputValue) => {
									setInputValue(newInputValue);
								}}
								options={cities}
								autoHighlight
								getOptionLabel={(option) => option.name}
								renderOption={(props, option) => (
									<Box component="li" {...props}>
										{option.name}
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
						</FormControl>

						<FormControl sx={{ width: '100px' }}>
							<InputLabel id="enabled">Активировать</InputLabel>
							<Select
								labelId="enabled"
								name="enabled"
								id="enabled"
								value={plant.enabled}
								label="enabled"
								onChange={handleChange}
							>
								<MenuItem value="true">Да</MenuItem>
								<MenuItem value="false">Нет</MenuItem>
							</Select>
						</FormControl>
					</div>
					<TextField
						label="Информация о оборудовании"
						rows={4}
						multiline
						fullWidth
						required
						variant="outlined"
						name="info"
						onChange={handleChange}
						value={plant.info}
					/>

					<div lassName={classes.upload}>
						<div className={classes.fileBlock}>
							<InputLabel>Файлы (Для скачивания!)</InputLabel>
							<FilesUploadMulti
								plant={plantFiles}
								selectIndex={selectIndex}
								files={files}
								setFiles={setFiles}
								variant={2}
								allowedFiles={allowedFiles.plantFiles}
								subject={'оборудование'}
							/>
						</div>

						<div className={classes.fileBlock}>
							<InputLabel>Изображения </InputLabel>
							<FilesUploadMulti
								plant={plantPhoto}
								selectIndex={selectIndex}
								setSelectIndex={setSelectIndex}
								files={pfiles}
								setFiles={setPfiles}
								variant={1}
								allowedFiles={allowedFiles.photo}
								subject={'оборудование'}
							/>
						</div>
					</div>
					<OwnerForm setOwnerInfo={setOwnerInfo} ownerInfo={ownerInfo} />
					<CheckFilesQuantity
						needPhoto={isCheckFiles.needPhoto}
						manyPhoto={isCheckFiles.manyPhoto}
						manyFiles={isCheckFiles.manyFiles}
					/>
					<ErrorMessage message={message} />
					<Button
						variant="contained"
						color="primary"
						size="large"
						sx={{ width: '30%', margin: '30px auto' }}
						type="submit"
					>
						Сохранить
					</Button>
				</form>
			</div>
		</>
	);
};

export default AddPlantNew;
