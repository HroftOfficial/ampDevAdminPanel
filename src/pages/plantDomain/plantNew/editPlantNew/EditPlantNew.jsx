import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PlantNewService from '../../../../services/PlantNewService';
import PlantGroupNewService from '../../../../services/PlantGroupNewService';
import PlantMainGroupService from '../../../../services/PlantMainGroupService';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';
import config from '../../../../settings/config';
import OwnerForm from '../../../../components/OwnerForm/OwnerForm';
import FilesUploadMulti from '../../../../components/FilesUploadMulti/FilesUploadMulti';
import allowedFiles from '../../../../utils/allowedFiles';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { CheckFilesQuantity } from '../../../../components/FilesUploadMulti/CheckFilesQuantity/CheckFilesQuantity';
import classes from './EditPlantNew.module.css';

const { uploadPlantPhoto } = config;

const EditPlantNew = () => {
	const { id } = useParams();

	const [plant, setPlant] = useState({
		plantGroup: '',
		name: '',
		newPlant: false,
		price: '',
		info: '',
	});

	const [plantMainGroup, setPlantMainGroup] = useState(''); // выбранная основная группа

	const [message, setMessage] = useState('');
	const [plantGroup, setPlantGroup] = useState([]); //массив подгрупп оборудования
	const [mainGroup, setMainGroup] = useState([]); //массив основных групп
	const [ownerInfo, setOwnerInfo] = useState(null); //выбранный владелец
	///files
	const [plantPhoto, setPlantPhoto] = useState([]); //загруженные фото
	const [plantFiles, setPlantFiles] = useState([]); // загруженные файлы
	const [selectIndex, setSelectIndex] = useState(0); // индекс фото для превью
	const [pfiles, setPfiles] = useState([]); //photo add draft
	const [files, setFiles] = useState([]); //files add draft
	const [isCheckFiles, setIsCheckFiles] = useState({
		needPhoto: false,
		manyPhoto: false,
		manyFiles: false,
	}); // проверка количества файлов и фото
	///files

	const navigate = useNavigate();

	const handleChange = (e) => {
		setPlant((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	useEffect(() => {
		async function getItemPlant(id) {
			try {
				const response = await PlantNewService.fetchItemPlant(id);
				setPlant(response?.data?.plantData);
				setPlantPhoto(response?.data?.plantData?.photo_plant);
				setPlantFiles(response?.data?.plantData?.file_plant);
				setPlantMainGroup(response?.data?.mainGroup?.plantGroupAp);
				setOwnerInfo({
					name: response?.data?.plantData?.inhereUser.inhereUserName,
					id: response?.data?.plantData?.inhereUser.inhereUserId,
				});
				setSelectIndex(response?.data?.plantData?.index_photo);
			} catch (error) {
				console.error(error?.response?.data?.message);
			}
		}
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
		getItemPlant(id);
		getPlantGroup();
	}, [id]);

	async function updatePlant(e) {
		try {
			e.preventDefault();
			if (!ownerInfo) {
				setMessage('Выберите владельца!');
				return null;
			}
			if (pfiles?.length + plantPhoto?.length < 1) {
				setIsCheckFiles({ ...isCheckFiles, needPhoto: true });
				return;
			}
			if (pfiles?.length + plantPhoto?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyPhoto: true });
				return;
			}
			if (files?.length + plantFiles?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyFiles: true });
				return;
			}
			setIsCheckFiles({ needPhoto: false, manyPhoto: false, manyFiles: false });
			setMessage('');
			const f_data = new FormData();
			f_data.append('name', plant.name);
			f_data.append('plantGroup', plant.plantGroup);
			f_data.append('newPlant', plant.newPlant);
			f_data.append('price', plant.price);
			f_data.append('info', plant.info);
			Object.values(pfiles).forEach((item) => {
				f_data.append('photo_plant', item);
			});
			Object.values(files).forEach((item) => {
				f_data.append('file_plant', item);
			});
			f_data.append('index_photo', selectIndex);
			f_data.append('inhere_user', ownerInfo.id);
			f_data.append('inhere_user_name', ownerInfo.name);
			await PlantNewService.updateAll(f_data, id);
			navigate('/plantNew');
		} catch (error) {
			setMessage(error?.response?.data?.message);
			console.error(error?.response?.data?.message);
		}
	}

	const handleDeleteFile = async (values) => {
		try {
			const f_data = new FormData();
			f_data.append('filename', values);

			await PlantNewService.deletePlantFile(id, f_data);
			setPlantFiles((prevState) =>
				prevState.filter((el) => el.filename !== values)
			);
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeletePhoto = async (values) => {
		try {
			if (plantPhoto.length > 1) {
				const f_data = new FormData();
				f_data.append('filename', values);
				await PlantNewService.deletePlantFile(id, f_data);
				setPlantPhoto((prevState) =>
					prevState.filter((el) => el.filename !== values)
				);
				setSelectIndex(0);
			} else {
				setMessage(
					'Для успешного удаления данного файла загрузите на сервер новые фото'
				);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<div className={classes.wrapper}>
				<h2>Редактировать оборудование</h2>

				<form onSubmit={updatePlant} className={classes.form}>
					<div className={classes.topForm}>
						<FormControl sx={{ width: '40%' }}>
							<InputLabel id="mainGroup">
								Основная группа оборудования
							</InputLabel>
							<Select
								labelId="mainGroup"
								id="mainGroup"
								name="mainGroup"
								value={plantMainGroup}
								label="mainGroup"
								onChange={(event) => setPlantMainGroup(event.target.value)}
							>
								{mainGroup?.map((item) => (
									<MenuItem key={item?._id} value={item?._id}>
										{item?.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ width: '40%' }}>
							<InputLabel id="group">Группа оборудования</InputLabel>
							<Select
								labelId="group"
								id="group"
								name="plantGroup"
								value={plant.plantGroup}
								label="group"
								onChange={handleChange}
							>
								{plantGroup
									?.filter((item) => item.mainId[0] === plantMainGroup)
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
							variant="outlined"
							sx={{ width: '45%' }}
							label="Название оборудования"
							onChange={handleChange}
							required
							value={plant.name}
						/>

						<FormControl sx={{ width: '100px' }}>
							<InputLabel id="newPlant">Новое</InputLabel>
							<Select
								labelId="newPlant"
								id="newPlant"
								name="newPlant"
								value={plant.newPlant}
								label="newPlant"
								onChange={handleChange}
							>
								<MenuItem value="false">нет</MenuItem>
								<MenuItem value="true">да</MenuItem>
							</Select>
						</FormControl>
						<TextField
							id="price"
							name="price"
							label="Стоимость"
							variant="outlined"
							onChange={handleChange}
							required
							value={plant.price}
						/>
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
					<div className={classes.upload}>
						<div className={classes.fileBlock}>
							<InputLabel>Файлы </InputLabel>
							<FilesUploadMulti
								plant={plantFiles}
								selectIndex={selectIndex}
								files={files}
								setFiles={setFiles}
								variant={2}
								allowedFiles={allowedFiles.plantFiles}
								subject={'оборудование'}
								// deletedPath = {deletedPath}
								// setDeletedPath ={setDeletedPath}
								handleDeleteFile={handleDeleteFile}
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
								// deletedPath = {deletedPath}
								// setDeletedPath ={setDeletedPath}
								handleDeleteFile={handleDeletePhoto}
								pathFileUpload={uploadPlantPhoto}
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

export default EditPlantNew;
