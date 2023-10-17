import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	InputLabel,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	Chip,
	Box,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FilesUploadMulti from '../../../components/FilesUploadMulti/FilesUploadMulti';
import allowedFiles from '../../../utils/allowedFiles';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import AccessLevelForm from '../../../components/AccessLevelForm/AccessLevelForm';
import OwnerForm from '../../../components/OwnerForm/OwnerForm';
import { TomsModal } from '../../../components/TomsModal/TomsModal';
import { CheckFilesQuantity } from '../../../components/FilesUploadMulti/CheckFilesQuantity/CheckFilesQuantity';
import User from '../../../services/TomsService';
import Orders from '../../../services/ZakazService';
import { cities } from '../../../utils/cities-name';

import classes from './AddZakaz.module.css';

const AddZakazAdm = () => {
	const navigate = useNavigate();
	const [order, setOrder] = useState({
		title: '',
		many: null,
		comment: '',
		kl: null,
		kl_text: '',
		max_width: null,
		max_d: null,
		cities: '',
		details: '',
	});

	const [message, setMessage] = useState('');
	///files
	const plantPhoto = []; //заглушка для фото
	const plantFiles = []; //заглушка для файлов
	const [selectIndex, setSelectIndex] = useState(0); // индекс фото для превью
	const [inputValue, setInputValue] = useState(''); //выбранный город
	const [pfiles, setPfiles] = useState([]); //photo add draft
	const [files, setFiles] = useState([]); //files add draft
	const [listToms, setListToms] = useState([]); // загружает в модалку виды мехобработки
	const [stateWork, setStateWork] = useState([]); //выбранная группа доступа
	const [selectedToms, setSelectedToms] = useState([]); //выбранные виды обработки [объект]
	const [openModal, setOpenModal] = useState(false); //модалка для видов обработки
	const [ownerInfo, setOwnerInfo] = useState(null); //выбранный владелец
	const [isCheckFiles, setIsCheckFiles] = useState({
		needPhoto: false,
		manyPhoto: false,
		manyFiles: false,
	}); // проверка количества файлов и фото

	useEffect(() => {
		const getTomsList = async () => {
			try {
				const toms = await User.getUsersToms();
				setListToms(toms.data);
			} catch (error) {
				console.log(error);
			}
		};
		getTomsList();
	}, []);

	const handleChange = (e) => {
		setOrder((prev) => ({ ...prev, [e.target.name]: e.target?.value }));
	};

	const handleDelete = (index) => {
		const newArr = [...selectedToms];
		newArr.splice(index, 1);
		setSelectedToms([...newArr]);
	};
	const handleOpenModal = () => {
		setOpenModal(true);
	};

	const createOrder = async (e) => {
		e.preventDefault();
		try {
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

			// const form = new FormData(e.currentTarget);
			let resultWork = stateWork;
			if (!resultWork.length) {
				resultWork = ['0'];
			}
			const form = new FormData();
			Object.values(pfiles).forEach((item) => {
				form.append('photo_url', item);
			});
			Object.values(files).forEach((item) => {
				form.append('file_url', item);
			});
			Object.values(resultWork).forEach((item) => {
				form.append('zakaz_access_level', item);
			});
			Object.values(selectedToms).forEach((category) => {
				form.append('work_category', category.id);
			});

			form.append('title', order.title);
			form.append('many', order.many);
			form.append('comment', order.comment);
			form.append('kl', order.kl);
			form.append('kl_text', order.kl_text);
			form.append('max_width', order.max_width);
			form.append('max_d', order.max_d);
			form.append('cities', inputValue);
			form.append('details', order.details);
			form.append('inhere_user', ownerInfo.id);
			form.append('inhere_user_name', ownerInfo.name);

			const response = await Orders.addZakaz(form);
			navigate('/zakazes');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<TomsModal
				open={openModal}
				setOpen={setOpenModal}
				data={listToms}
				selected={selectedToms}
				setSelected={setSelectedToms}
			/>
			<div className={classes.wrapper}>
				<h2>Создать заказ</h2>

				<form onSubmit={createOrder} className={classes.form}>
					<div className={classes.topForm}>
						<TextField
							id="title"
							name="title"
							variant="outlined"
							label="Название заказа"
							sx={{ width: '30%' }}
							value={order.title}
							onChange={handleChange}
							required
						/>
						<TextField
							id="many"
							name="many"
							variant="outlined"
							value={order.many}
							label="Бюджет"
							onChange={handleChange}
							type="number"
							required
						/>
						<TextField
							id="comment"
							name="comment"
							variant="outlined"
							value={order.comment}
							label="Комментарий к бюджету"
							onChange={handleChange}
							type="text"
							required
						/>
						<TextField
							id="kl"
							name="kl"
							variant="outlined"
							label="Количество деталей"
							value={order.kl}
							onChange={handleChange}
							type="number"
							required
						/>
						<FormControl sx={{ minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">
								Периодичность
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={order.kl_text}
								label="kl_text"
								onChange={(event) =>
									setOrder({ ...order, kl_text: event.target.value })
								}
							>
								<MenuItem value={'партия'}>Партия</MenuItem>
								<MenuItem value={'мес/шт'}>шт/мес</MenuItem>
								<MenuItem value={'год/шт'}>шт/год</MenuItem>
								<MenuItem value={'шт.'}>шт.</MenuItem>
							</Select>
						</FormControl>

						<TextField
							value={order.max_width}
							onChange={handleChange}
							name="max_width"
							label="Max длина (линейный размер)"
						/>
						<TextField
							value={order.max_d}
							onChange={handleChange}
							name="max_d"
							label="Max диаметр"
						/>
						{/* <TextField
							value={order.cities}
							onChange={handleChange}
							name="cities"
							label="Город доставки"
						/> */}
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
					</div>
					<TextField
						label="Описание заказа"
						rows={4}
						multiline
						required
						name="details"
						variant="outlined"
						value={order.details}
						onChange={handleChange}
					/>

					{!!selectedToms?.length && (
						<>
							<div className={classes.legend}>Выбранные виды мехобработки:</div>
							<div className={classes.stackChips}>
								{selectedToms?.map((item, index) => (
									<Chip
										className="tom"
										key={item.id}
										id={item.id}
										label={item.name}
										variant="outlined"
										onDelete={() => handleDelete(index)}
									/>
								))}
							</div>
						</>
					)}

					<button
						type="button"
						className={classes.actionMenu}
						onClick={handleOpenModal}
					>
						Добавить виды обработки
					</button>
					<div className={classes.upload}>
						<div className={classes.fileBlock}>
							<InputLabel>Файлы (Для скачивания!)</InputLabel>
							<FilesUploadMulti
								plant={plantFiles}
								selectIndex={selectIndex}
								// setSelectIndex = {setSelectIndex}
								files={files}
								setFiles={setFiles}
								variant={2}
								allowedFiles={allowedFiles.draftFiles}
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
					<AccessLevelForm selected={stateWork} setSelected={setStateWork} />
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
						// onClick={(e) => createOrder(e)}
						type="submit"
					>
						Сохранить
					</Button>
				</form>
			</div>
		</>
	);
};

export default AddZakazAdm;
