import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import {
	InputLabel,
	TextField,
	Select,
	MenuItem,
	FormControl,
	Chip,
	Button,
	Box,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import ZakazService from '../../../services/ZakazService';
import User from '../../../services/TomsService';
import config from '../../../settings/config';
import FilesUploadMulti from '../../../components/FilesUploadMulti/FilesUploadMulti';
import allowedFiles from '../../../utils/allowedFiles';
import { CheckFilesQuantity } from '../../../components/FilesUploadMulti/CheckFilesQuantity/CheckFilesQuantity';
import OwnerForm from '../../../components/OwnerForm/OwnerForm';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import Autocomplete from '@mui/material/Autocomplete';
// import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { TomsModal } from '../../../components/TomsModal/TomsModal';
import AccessLevelForm from '../../../components/AccessLevelForm/AccessLevelForm';
import { cities } from '../../../utils/cities-name';
import classes from './EditZakaz.module.css';

const { uploadDraftPhoto } = config;

const EditZakaz = () => {
	const { id } = useParams();
	// const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const [order, setOrder] = useState({
		title: '',
		many: 0,
		comment: '',
		kl: 0,
		kl_text: '',
		max_width: '',
		max_d: '',
		cities: '',
		details: '',
	});
	const [message, setMessage] = useState('');
	const [listToms, setListToms] = useState([]); // загружает в модалку виды мехобработки
	const [openModal, setOpenModal] = useState(false); //модалка для видов обработки
	const [selectedToms, setSelectedToms] = useState([]); //выбранные виды обработки [объект]
	const [inputValue, setInputValue] = useState(''); //выбранный город
	const [ownerInfo, setOwnerInfo] = useState({ name: '', _id: '' }); //имя и id владельца заказа
	const [previewLoadPhoto, setPreviewLoadPhoto] = useState([]); // устанавливает массив для превью фото
	const [previewLoadFile, setPreviewLoadFile] = useState([]); // устанавливает массив для првью файлов
	const [isCheckFiles, setIsCheckFiles] = useState({
		needPhoto: false,
		manyPhoto: false,
		manyFiles: false,
	}); // проверка количества файлов и фото
	const [stateWork, setStateWork] = useState([]); //выбранная группа доступа
	const [previewPhoto, setPreviewPhoto] = useState([]);
	const [previewFile, setPreviewFile] = useState([]);
	const [newPreviewPhoto, setNewPreview] = useState(0);

	useEffect(() => {
		const getOrderById = async () => {
			try {
				const toms = await User.getUsersToms();
				const editedZakaz2 = await ZakazService.getZakazFilesToId(id);
				const editedZakaz = editedZakaz2?.data;

				setListToms(toms.data);
				setOrder(editedZakaz);

				setValue('title', editedZakaz.title);
				setValue('kl', editedZakaz.kl);
				setValue('details', editedZakaz.details);
				setStateWork(editedZakaz?.zakaz_access_level);

				setNewPreview(editedZakaz?.index_photo);
				setSelectedToms(editedZakaz?.work_info);
				setOwnerInfo({
					name: editedZakaz?.inhere_user_name,
					id: editedZakaz?.inhere_user,
				});
				setPreviewLoadPhoto(editedZakaz?.photo_url);
				setPreviewLoadFile(editedZakaz?.file_url);
			} catch (e) {
				console.error('Error >>> ', e);
			}
		};
		getOrderById();
	}, []);

	const handleDelete = (index) => {
		const newArr = [...selectedToms];
		newArr.splice(index, 1);
		setSelectedToms([...newArr]);
	};

	const handleDeleteFile = async (values) => {
		try {
			const f_data = new FormData();
			f_data.append('filename', values);

			await ZakazService.deleteZakazFile(id, f_data);
			setPreviewLoadFile((prevState) =>
				prevState.filter((el) => values !== el.filename)
			);
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeletePhoto = async (values) => {
		try {
			if (previewLoadPhoto.length > 1) {
				const f_data = new FormData();
				f_data.append('filename', values);
				await ZakazService.deleteZakazFile(id, f_data);
				setPreviewLoadPhoto((prevState) =>
					prevState.filter((el) => el.filename !== values)
				);
				setNewPreview(0);
			} else {
				setMessage(
					'Для успешного удаления данного файла загрузите на сервер новые фото'
				);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const warningTitle = {
		max: 'Максимальная длина заголовка 50 символов',
		min: 'Минимальная длина заголовка 2 символа',
		required: 'Заголовок не может быть пустым',
	};

	const warningDetails = {
		required: 'Заполните описание',
	};

	const warningKl = {
		required: 'Укажите количество',
	};

	const editZakazSchema = yup.object({
		title: yup
			.string()
			.required(warningTitle.required)
			.min(2, warningTitle.min)
			.max(50, warningTitle.max),
		details: yup.string().required(warningDetails.required),
		kl: yup.string().required(warningKl.required),
	});

	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(editZakazSchema),
		defaultValues: {
			title: order.title,
			details: order.details,
			kl: order.kl,
		},
	});

	const onSubmit = async (data, e) => {
		e.preventDefault();
		try {
			const photos = previewPhoto;
			const files = previewFile;

			let resultWork = stateWork;
			if (!resultWork.length) {
				resultWork = ['0'];
			}

			if (photos?.length + previewLoadPhoto?.length < 1) {
				setIsCheckFiles({ ...isCheckFiles, needPhoto: true });
				return;
			}
			if (photos?.length + previewLoadPhoto?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyPhoto: true });
				return;
			}
			if (files?.length + previewLoadFile?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyFiles: true });
				return;
			}
			setIsCheckFiles({ needPhoto: false, manyPhoto: false, manyFiles: false });

			const formData = new FormData();

			formData.append('title', data.title);
			formData.append('many', order.many);
			formData.append('comment', order.comment);
			formData.append('kl', data.kl);
			formData.append('kl_text', order.kl_text);
			formData.append('max_width', order.max_width);
			formData.append('max_d', order.max_d);
			if (inputValue.trim()) {
				formData.append('cities', inputValue);
			} else {
				formData.append('cities', order.cities);
			}
			formData.append('details', data.details);
			formData.append('index_photo', newPreviewPhoto);
			formData.append('inhere_user', ownerInfo.id);
			formData.append('inhere_user_name', ownerInfo.name);

			Object.values(resultWork).forEach((item) => {
				formData.append('zakaz_access_level', item);
			});
			Object.values(selectedToms).forEach((category) => {
				formData.append('work_category', category.id);
			});
			Object.values(photos).forEach((photo) => {
				formData.append('photo_url', photo);
			});
			Object.values(files).forEach((file) => {
				formData.append('file_url', file);
			});

			// console.log(...formData);
			const response = await ZakazService.editZakaz(id, formData);
			navigate('/zakazes');
		} catch (e) {
			console.error('Error >>> ', e);
		}
	};

	const handleChange = (e) => {
		setOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleOpenModal = () => {
		setOpenModal(true);
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
				<h2>
					Редактирование заказа: № {order?.number} <br />
					<div className={classes.legend}>{order?.title}</div>
				</h2>

				<form
					className={classes.form}
					enctype="multipart/form-data"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className={classes.topForm}>
						<Controller
							control={control}
							render={({ field: { onChange, value } }) => (
								<div
									className={classes.inputWrapper}
									style={{ width: '30%' }}
									errorState={!!errors.title}
								>
									{errors.title ? (
										<p className={classes.errorMessage}>
											{errors.title.message}
										</p>
									) : (
										<></>
									)}
									<TextField
										type="text"
										label="Название заказа"
										value={value}
										{...register('title')}
									/>
								</div>
							)}
							name="title"
							rules={{ required: true }}
						/>
						<TextField
							value={order.many}
							name="many"
							onChange={handleChange}
							label="Бюджет"
						/>
						<TextField
							value={order.comment}
							name="comment"
							onChange={handleChange}
							label="Комментарий к бюджету"
						/>

						<Controller
							control={control}
							render={({ field: { onChange, value } }) => (
								<div className={classes.inputWrapper} errorState={!!errors.kl}>
									{errors.kl ? (
										<p className={classes.errorMessage}>{errors.kl.message}</p>
									) : (
										<></>
									)}
									<TextField
										type="text"
										label="Количество деталей"
										value={value}
										{...register('kl')}
									/>
								</div>
							)}
							name="kl"
							rules={{ required: true }}
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

						<FormControl sx={{ width: '300px' }}>
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
										label={`Город доставки - ${order.cities}`}
										inputProps={{
											...params.inputProps,
											autoComplete: 'new-cities', // disable autocomplete and autofill
										}}
									/>
								)}
							/>
						</FormControl>
					</div>

					<Controller
						control={control}
						render={({ field: { onChange, value } }) => (
							<div
								className={classes.inputWrapper}
								errorState={!!errors.details}
							>
								{errors.details ? (
									<p className={classes.errorMessage}>
										{errors.details.message}
									</p>
								) : (
									<></>
								)}
								<TextField
									label="Описание заказа"
									value={value}
									rows={4}
									multiline
									{...register('details')}
								/>
							</div>
						)}
						name="details"
						rules={{ required: true }}
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
							<InputLabel>Файлы </InputLabel>
							<small>
								Разрешенные форматы: pdf, doc, docx, xls, xlsx, png, jpg, jpeg,
								dvg, dwg, gif.
							</small>
							<FilesUploadMulti
								plant={previewLoadFile}
								files={previewFile}
								setFiles={setPreviewFile}
								variant={2}
								subject={'заказ'}
								allowedFiles={allowedFiles.draftFiles}
								handleDeleteFile={handleDeleteFile}
							/>
						</div>

						<div className={classes.fileBlock}>
							<InputLabel>Изображения </InputLabel>

							<small>Разрешенные форматы: png, jpg, jpeg.</small>
							<FilesUploadMulti
								plant={previewLoadPhoto}
								selectIndex={newPreviewPhoto}
								setSelectIndex={setNewPreview}
								files={previewPhoto}
								setFiles={setPreviewPhoto}
								variant={1}
								subject={'заказ'}
								allowedFiles={allowedFiles.photo}
								handleDeleteFile={handleDeletePhoto}
								pathFileUpload={uploadDraftPhoto}
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
						color="success"
						type="submit"
						size="large"
						sx={{ width: '30%', margin: '30px auto' }}
					>
						Отправить
					</Button>
				</form>
			</div>
		</>
	);
};

export default EditZakaz;
