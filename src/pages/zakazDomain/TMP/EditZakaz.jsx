import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { InputLabel } from '@mui/material';
import ZakazService from '../../services/ZakazService';
import config from '../../settings/config';
import Modal from './VidiModal';
import User from '../../services/TomsService';
import UserServicePortal from '../../services/UserServicePortal';
import WorkGroupService from '../../services/WorkGroupService';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FilesUploadMulti from '../../components/FilesUploadMulti/FilesUploadMulti';
import allowedFiles from '../../utils/allowedFiles';
import { CheckFilesQuantity } from '../../components/FilesUploadMulti/CheckFilesQuantity/CheckFilesQuantity';
import classes from './AddZakaz.module.css';

const { uploadDraftPhoto } = config;

const EditOrder = () => {
	const [ready, setReady] = useState(false);
	const [mainOrder, setMainOrder] = useState([]); // большой главный заказ
	const [showModal, setShowModal] = useState(false); // скрыть моказать модалку мехобработок
	const [listVidi, setListVidi] = useState([]); // загружает в модалку виды мехобработки
	const [selected, setSelected] = useState([]); // хранится массив выбранных ID мехобработок, из модалки
	const [selectedText, setSelectedText] = useState([]); // хранится массив выбранных имен мехобработок, из модалки
	const [lengthFile, setLengthFile] = useState([]); // стейт выбранных файлов
	const [lengthPhoto, setLengthPhoto] = useState([]); // стейт выбранных фото
	const [title, setTitle] = useState(''); // загружает заголовок ..
	const [many, setMany] = useState('');
	const [kl, setKl] = useState('');
	const [kl_text, setKl_text] = useState('партия');
	const [max_width, setMax_width] = useState('');
	const [max_d, setMax_d] = useState('');
	const [cities, setCities] = useState('');
	const [details, setDetail] = useState('');

	const [idWorkUser, setIdWorkUser] = useState('');
	const [nameWorkUser, setNameWorkUser] = useState('');
	const [access_level, setAccess_level] = useState([0]);

	const [work_category, setWork_category] = useState('');

	const [previewLoadPhoto, setPreviewLoadPhoto] = useState([]); // устанавливает массив для превью фото
	const [previewLoadFile, setPreviewLoadFile] = useState([]); // устанавливает массив для првью файлов
	const [deletedArrayPhoto, setDeletedArrayPhoto] = useState([]); // массив с ID удаленных фото, для отправки на сервер
	const [deletedArrayFile, setDeletedArrayFile] = useState([]); // массив с ID удаленных файлов, для отправки на сервер

	const [isCheckFiles, setIsCheckFiles] = useState({
		needPhoto: false,
		manyPhoto: false,
		manyFiles: false,
	});
	const navigate = useNavigate();

	const { id } = useParams();

	const [workGroup, setWorkGroup] = useState([]);
	const [listUsers, setListUsers] = useState([]);

	const [arrayIdGroup, setArrayIdGroup] = useState([]);
	const [arrayNameUsers, setArrayNameUsers] = useState([]);

	const [access, setAccess] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const vidi = await User.getUsersToms();
				setListVidi(vidi.data);

				const editedZakaz2 = await ZakazService.getZakazFilesToId(id);
				const editedZakaz = editedZakaz2?.data;
				// console.log(editedZakaz)
				// console.log('All orders >>> ', orders)
				// console.log('All vidi >>> ', vidi)
				const workGroup = await WorkGroupService.fetchWorkGroup();
				const listUsers = await UserServicePortal.fetchUsers();
				// console.log('workGroup', workGroup)
				// console.log('listUsers', listUsers)
				setWorkGroup(workGroup?.data);
				setListUsers(listUsers?.data);

				// console.log('Order to EDIT >>> ',   editedZakaz)
				setValue('title', editedZakaz.title);
				setValue('kl', editedZakaz.kl);
				setValue('details', editedZakaz.details);

				setMainOrder(editedZakaz);
				setTitle(editedZakaz?.title);
				setMany(editedZakaz?.many);
				setKl(editedZakaz?.kl);
				setKl_text(editedZakaz?.kl_text);
				setMax_width(editedZakaz?.max_width);
				setMax_d(editedZakaz?.max_d);
				setCities(editedZakaz?.cities);
				setDetail(editedZakaz?.details);
				setNewPreview(editedZakaz?.index_photo);
				setWork_category(editedZakaz?.work_category);
				setSelected(editedZakaz?.work_category);
				setIdWorkUser(editedZakaz?.inhere_user);
				setNameWorkUser(editedZakaz?.inhere_user_name);
				setAccess_level(editedZakaz?.zakaz_access_level[0]);
				// console.log('Work_category >> ', item.work_category)
				// console.log('Work_info >> ', item.work_info)
				setPreviewLoadPhoto(editedZakaz?.photo_url);
				setPreviewLoadFile(editedZakaz?.file_url);

				// console.log('LengthPhoto >> ', lengthPhoto);
				// console.log('LengthFile >> ', lengthFile);
				const array = [];
				editedZakaz.work_info.forEach((item) => {
					array.push(item?.name);
				});

				const arrayIdGroup = [];
				workGroup.data.forEach((item) => {
					arrayIdGroup.push(item?._id);
				});

				const arrayNameUser = [];
				listUsers.data.forEach((item) => {
					arrayNameUser.push(item?.org);
				});

				// console.log('work array', array)
				// console.log('arrayIdGroup', workGroup)
				// console.log('arrayNameUser', listUsers)
				// console.log('idWorkUser', idWorkUser)
				// console.log('nameWorkUser', nameWorkUser)
				setSelectedText(array);
				setArrayIdGroup(arrayIdGroup);
				setArrayNameUsers(arrayNameUser);
			} catch (e) {
				console.error('Error >>> ', e);
			} finally {
				setReady(true);
			}
		})();
	}, []);
	// console.log(selected)
	const handleOpenMenu = (e) => {
		e.preventDefault();
		setShowModal(true);
	};

	window.onclick = (e) => {
		const modal = document.getElementById('vidiModal');
		if (e.target == modal) {
			setShowModal(false);
		}
	};

	const handleDelete = (e) => {
		// console.log(e)
		const id = e.target?.parentElement.children[0].id;
		const name = e.target?.parentElement.children[0].innerText;

		const tempSelected = selected.slice();
		tempSelected.splice(id, 1);
		setSelected(tempSelected);

		const tempSelectedText = selectedText.slice();
		const index2 = tempSelectedText.indexOf(name);
		tempSelectedText.splice(index2, 1);
		setSelectedText(tempSelectedText);

		// console.log('DELETED >> ', id)
		// console.log('DELETED >> ', name)
	};

	const [previewPhoto, setPreviewPhoto] = useState([]);
	const [previewFile, setPreviewFile] = useState([]);

	const [newPreviewPhoto, setNewPreview] = useState();

	const handleNewPreview = (e) => {
		const name = e.target?.id;
		// console.log(name)
		setNewPreview(name);
	};

	const handleDeleteFile = async (values) => {
		setDeletedArrayFile((prevState) => [...prevState, values]);
		setPreviewLoadFile((prevState) =>
			prevState.filter((el) => values !== el.filename)
		);
	};

	const handleDeletePhoto = async (values) => {
		setDeletedArrayPhoto((prevState) => [...prevState, values]);
		setPreviewLoadPhoto((prevState) =>
			prevState.filter((el) => values !== el.filename)
		);
	};

	const [inputText, setInputText] = useState('');
	let inputHandler = (e) => {
		//convert input text to lower case
		var lowerCase = e.target?.value.toLowerCase();
		setInputText(lowerCase);
	};

	const filteredData = listUsers.filter((el) => {
		//if no input the return the original
		if (inputText === '') {
			return el;
		}
		//return the item which contains the user input
		else {
			return el.org?.toLowerCase().includes(inputText);
		}
	});

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

	const warningPhoto = {
		required: 'Загрузите минимум 1 фото',
		large: 'Фото слишком большие',
		type: 'Недопустимый формат фото',
	};

	const warningFile = {
		required: 'Загрузите минимум 1 файл',
		large: 'Файлы слишком большие',
		type: 'Недопустимый формат файлов',
	};

	const editZakazSchema = yup.object({
		title: yup
			.string()
			.required(warningTitle.required)
			.min(2, warningTitle.min)
			.max(50, warningTitle.max),
		details: yup.string().required(warningDetails.required),
		kl: yup.string().required(warningKl.required),
		// photo: yup
		// 	.mixed()
		// 	// .test('required', warningPhoto.required, (value) =>{
		// 	//   return value && value.length
		// 	// } )
		// 	.test('fileSize', warningPhoto.large, (value, context) => {
		// 		if (value.length < 1) return true;
		// 		return value && value[0] && value[0].size <= 2000000;
		// 	})
		// 	.test('type', warningPhoto.type, function (value) {
		// 		if (value.length < 1) return true;
		// 		return (
		// 			value &&
		// 			value[0] &&
		// 			(value[0].type === 'image/jpeg' ||
		// 				value[0].type === 'image/jpg' ||
		// 				value[0].type === 'image/png')
		// 		);
		// 	}),
		// file: yup
		// 	.mixed()
		// 	// .test('required', warningFile.required, (value) =>{
		// 	//   return value && value.length
		// 	// } )
		// 	.test('fileSize', warningFile.large, (value, context) => {
		// 		if (value.length < 1) return true;
		// 		return value && value[0] && value[0].size <= 2000000;
		// 	})
		// 	.test('type', warningFile.type, function (value) {
		// 		if (value.length < 1) return true;
		// 		return (
		// 			value &&
		// 			value[0] &&
		// 			(value[0].type === 'image/jpeg' ||
		// 				value[0].type === 'image/jpg' ||
		// 				value[0].type === 'image/png' ||
		// 				value[0].type === 'image/xls' ||
		// 				value[0].type === 'image/docx' ||
		// 				value[0].type === 'image/doc' ||
		// 				value[0].type === 'image/pdf' ||
		// 				value[0].type === 'image/xlsx')
		// 		);
		// 	}),
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
			title: title,
			details: details,
			kl: kl,
			photo: [],
			file: [],
		},
	});

	// const [needPhoto, setNeedPhoto] = useState(false);
	// const [needFile, setNeedFile] = useState(false);
	// const [manyPhoto, setManyPhoto] = useState(false);
	// const [manyFile, setManyFile] = useState(false);

	const onSubmit = async (data, e) => {
		try {
			e.preventDefault();

			// console.log(e);
			// console.log(data);

			// const form = e.target?.form;
			// const title = form[0]?.value;
			// const many = form[1]?.value;
			// const kl = form[2]?.value;
			// const kl_text = form[3]?.value;
			// const max_width = form[4]?.value;
			// const max_d = form[5]?.value;
			// const cities = form[6]?.value;
			// const details = form[7]?.value;
			const photos = previewPhoto;
			const files = previewFile;

			const deletedFilesTitle = [
				...deletedArrayFile.flat(),
				...deletedArrayPhoto.flat(),
			];

			if (photos?.length + previewLoadPhoto?.length < 1) {
				setIsCheckFiles({ ...isCheckFiles, needPhoto: true });
				return;
			}
			// if (files?.length + previewLoadFile?.length < 1) {
			// 	setNeedFile(true);
			// 	return;
			// }
			if (photos?.length + previewLoadPhoto?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyPhoto: true });
				return;
			}
			if (files?.length + previewLoadFile?.length > 10) {
				setIsCheckFiles({ ...isCheckFiles, manyFiles: true });
				return;
			}
			// setNeedPhoto(false);
			// setNeedFile(false);
			// setManyPhoto(false);
			// setManyFile(false);

			const formData = new FormData();

			formData.append('title', data.title);
			formData.append('many', many);
			formData.append('kl', data.kl);
			formData.append('kl_text', kl_text);
			formData.append('max_width', max_width);
			formData.append('max_d', max_d);
			formData.append('cities', cities);
			formData.append('details', data.details);
			formData.append('index_photo', newPreviewPhoto);
			formData.append('inhere_user', idWorkUser);
			formData.append('inhere_user_name', nameWorkUser);
			formData.append('zakaz_access_level', access_level);

			Object.values(deletedFilesTitle).forEach((title) => {
				formData.append('delete_files', title);
			});

			Object.values(selected).forEach((category) => {
				formData.append('work_category', category);
			});

			Object.values(photos).forEach((photo) => {
				formData.append('photo_url', photo);
			});

			Object.values(files).forEach((file) => {
				formData.append('file_url', file);
			});

			const data2 = {
				id: mainOrder._id,
				many,
				kl_text,
				max_width,
				max_d,
				cities,
				selected,
				deletedFilesTitle,
				newPreviewPhoto,
			};

			// console.log("Sended from HookForm >> ", data);
			// console.log("Sended from state >> ", data2);
			// console.log("Sended Photo >> ", photos);
			// console.log("Sended Photo From Form >> ", data.photo);
			// console.log("Sended Files >> ", files);
			// console.log("Sended inhere_user >> ", idWorkUser);
			// console.log("Sended inhere_user_name >> ", nameWorkUser);

			const order = await ZakazService.editZakaz(mainOrder._id, formData);

			// console.log("Response editOrder >>> ", order);
			navigate('/zakazes');
		} catch (e) {
			console.error('Error >>> ', e);
		}
	};

	return (
		<Body>
			{ready && (
				<div className="context-wrapper ">
					<h2>
						Редактирование заказа: {mainOrder?.number} <br />
						<br />
						{mainOrder?.title}
					</h2>

					<Forma
						enctype="multipart/form-data"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="top">
							<Controller
								control={control}
								render={({ field: { onChange, value } }) => (
									<InputWrapper errorState={!!errors.title}>
										{errors.title ? (
											<ErrMessage> {errors.title.message} </ErrMessage>
										) : (
											<p>Название заказа</p>
										)}
										<input
											className="input"
											type="text"
											placeholder="Название заказа"
											value={value}
											{...register('title')}
										/>
									</InputWrapper>
								)}
								name="title"
								rules={{ required: true }}
							/>
							{/* <p>Название заказа</p> */}
							{/* <input value={title} onChange={(e) => setTitle(e.target?.value)} placeholder='Название заказа'/> */}

							<p>Стоимость</p>
							<input
								value={many}
								onChange={(e) => setMany(e.target?.value)}
								placeholder="Стоимость"
							/>

							<Controller
								control={control}
								render={({ field: { onChange, value } }) => (
									<InputWrapper errorState={!!errors.kl}>
										{errors.kl ? (
											<ErrMessage> {errors.kl.message} </ErrMessage>
										) : (
											<p>Количество деталей</p>
										)}
										<input
											className="input"
											type="text"
											placeholder="Количество деталей"
											value={value}
											{...register('kl')}
										/>
									</InputWrapper>
								)}
								name="kl"
								rules={{ required: true }}
							/>

							{/* <p>Количество деталей</p> */}
							{/* <input value={kl} onChange={(e) => setKl(e.target?.value)} placeholder='Количество деталей'/> */}

							<p>Периодичность</p>
							<select
								className="empty"
								value={kl_text}
								onChange={(e) => setKl_text(e.target?.value)}
							>
								<option disabled>Периодичность</option>
								<option value="партия">Партия</option>
								<option value="мес/шт">шт/мес</option>
								<option value="год/шт">шт/год</option>
								<option value="шт.">шт.</option>
							</select>

							<p>Max длина (линейный размер)</p>
							<input
								value={max_width}
								onChange={(e) => setMax_width(e.target?.value)}
								className="imput"
								placeholder="Max длина (линейный размер)"
							/>

							<p>Max диаметр</p>
							<input
								value={max_d}
								onChange={(e) => setMax_d(e.target?.value)}
								className="imput"
								placeholder="Max диаметр"
							/>

							<p>Город доставки</p>
							<input
								value={cities}
								onChange={(e) => setCities(e.target?.value)}
								className="imput"
								placeholder="Город доставки"
							/>
						</div>

						<Controller
							control={control}
							render={({ field: { onChange, value } }) => (
								<InputWrapper errorState={!!errors.details}>
									{errors.details ? (
										<ErrMessage> {errors.details.message} </ErrMessage>
									) : (
										<p>Описание заказа</p>
									)}
									<textarea
										placeholder="Описание заказа"
										value={value}
										{...register('details')}
									/>
								</InputWrapper>
							)}
							name="details"
							rules={{ required: true }}
						/>

						{/* <p>Описание заказа</p>
          <div className='bottom'>
            <textarea value={details} onChange={(e) => setDetail(e.target?.value)} placeholder='Описание заказа'></textarea>
          </div> */}

						{selectedText?.length > 0 && (
							<div className="toms">
								<h2>Выбранные виды мехобработки:</h2>

								{selectedText?.map((item, index) => (
									<div className="tom" key={index}>
										<div id={index}>{item}</div>
										<div className="close" onClick={handleDelete}>
											&times;
										</div>
									</div>
								))}
							</div>
						)}

						<button className="action" onClick={handleOpenMenu}>
							Добавить виды обработки
						</button>

						<div className={classes.upload}>
							<div className={classes.fileBlock}>
								<InputLabel>Файлы </InputLabel>
								<small>
									Разрешенные форматы: pdf, doc, docx, xls, xlsx, png, jpg,
									jpeg, dvg, dwg, gif.
								</small>
								<FilesUploadMulti
									plant={previewLoadFile}
									files={previewFile}
									setFiles={setPreviewFile}
									variant={2}
									subject={'заказ'}
									allowedFiles={allowedFiles.draftFiles}
									// deletedPath = {deletedPath}
									// setDeletedPath ={setDeletedPath}
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

						{/* {previewLoadPhoto?.length > 0 && (
							<div className="preview-wrapper">
								<div className="preview-place-photo">
									* отмечена фотография предпросмотра. В режиме редактирования,
									вы можете выбрать новую фотографию предпросмотра только из уже
									загруженных фотографий. Для того чтобы выбрать фотографию
									предпросмотра из новых фотографий - сначала загрузите их, а
									после установите здесь.
									{previewLoadPhoto?.map((img, index) => {
										return (
											<div key={index} className="preview-item-photo">
												<img
													src={`${config?.UPLOAD_API_URL}/uploads/${img.filename}`}
													id={index}
													alt="pic1"
													className="preview-img"
													onClick={handleNewPreview}
													style={{
														border:
															newPreviewPhoto == index
																? 'solid 2px #00AEAE'
																: 'none',
													}}
												/>
												<a
													href={`${config?.UPLOAD_API_URL}/uploads/${img.filename}`}
													target="_blank"
													noreferel="true"
												>
													Посмотреть
												</a>
												<button
													id={index}
													key={index}
													onClick={(e) => {
														removePhotoFromDownloads(e, index);
													}}
													className="delete-btn"
												>
													<img src={deleteIco} alt="" className="delete-btn" />
												</button>
											</div>
										);
									})}
								</div>

								<div className="preview-place-file">
									{previewLoadFile.map((file, index) => (
										<div key={index} className="preview-item-file">
											{/* <span onClick={handleFileOpen}>{file.filename}</span> */}
						{/* <a
												href={`${config?.UPLOAD_API_URL}/uploads/${file.filename}`}
												target="_blank"
												noreferel="true"
											>
												<span>{file.filename}</span>
											</a>
											<button
												id={index}
												key={index}
												onClick={(e) => removeFileFromDownloads(e, index)}
												className="delete-btn"
											>
												<img src={deleteIco} alt="" className="delete-btn" />
											</button>
										</div>
									))}
								</div>
							</div>
						)}  */}

						{/* <div className="upload">
							<div className="input">
								<label htmlFor="photo-input">
									{lengthPhoto?.length > 0
										? `Выбрано ${lengthPhoto?.length} фото`
										: `Загрузите до ${
												10 - previewLoadPhoto?.length
										  } фото заказа. Разрешенные форматы: png, jpg, jpeg.`}
									<img src={photoIco} alt="" />
								</label>

								<Controller
									control={control}
									name="photo"
									rules={{ required: false }}
									render={({ field: { onChange, value } }) => (
										<InputWrapper errorState={!!errors.photo}>
											{errors.photo ? (
												<ErrMessage> {errors.photo.message} </ErrMessage>
											) : null}
											<input
												// className="input"
												id="photo-input"
												type="file"
												multiple
												// value={value}
												onInput={onSelectPhoto}
												onChange={onChange}
												{...register('photo')}
											/>
										</InputWrapper>
									)}
								/>

								{manyPhoto && (
									<ErrMessage> Много фото, загрузите заново</ErrMessage>
								)}
							</div>

							<div className="input">
								<label htmlFor="file-input">
									{lengthFile?.length > 0
										? `Выбрано ${lengthFile?.length} файлов`
										: `Загрузите до ${
												10 - previewLoadFile?.length
										  } файлов заказа. Разрешенные форматы: pdf, doc, docx, xls, xlsx, png, jpg, jpeg.`}
									<img src={docIco} alt="" />
								</label>

								<Controller
									control={control}
									name="file"
									rules={{ required: true }}
									render={({ field: { onChange, value } }) => (
										<InputWrapper errorState={!!errors.file}>
											{errors.file ? (
												<ErrMessage> {errors.file.message} </ErrMessage>
											) : null}
											<input
												// className="input"
												id="file-input"
												type="file"
												multiple
												// value={value}
												onInput={onSelectFile}
												onChange={onChange}
												{...register('file')}
											/>
										</InputWrapper>
									)}
								/>

								{manyFile && (
									<ErrMessage> Много файлов, загрузите заново</ErrMessage>
								)}
							</div>
						</div> */}

						{/* <div className="preview-wrapper">
							<div className="preview-place-photo">
								{previewPhoto?.map((img, index) => (
									<div key={index} className="preview-item-photo">
										<img
											src={img}
											id={index}
											alt="pic1"
											className="preview-img"
											onClick={(e) => handleSelectFirst(e)}
										/>
										<button
											id={index}
											key={index}
											onClick={(e) => {
												removePhotoFromArray(e, index);
											}}
											className="delete-btn"
										>
											<img src={deleteIco} alt="" className="delete-btn" />
										</button>
									</div>
								))}
							</div>

							<div className="preview-place-file">
								{previewFile.map((file, index) => (
									<div key={index} className="preview-item-file">
										<span onClick={handleFileOpen}>{file?.name}</span>
										<button
											id={index}
											key={index}
											onClick={(e) => removeFileFromArray(e, index)}
											className="delete-btn"
										>
											<img src={deleteIco} alt="" className="delete-btn" />
										</button>
									</div>
								))}
							</div>
						</div> */}

						<Oweners>
							ЗАКАЗ ТРЕБУЕТ СПЕЦ РАЗРЕШЕНИЕ
							<div className="own-list">
								{workGroup?.map((item) => {
									if (item?.enabled == true) {
										return (
											<div key={item?._id} className="own-list__lable">
												<input
													id={item?._id}
													type="radio"
													name="spec"
													onClick={() => {
														// console.log(item)
														setNameWorkUser(item?.name);
														setIdWorkUser(item?._id);
														setAccess_level([item?.access_level]);
													}}
													defaultChecked={item?.access_level == access_level}
												/>
												<label htmlFor={item?._id}>{item?.name}</label>
											</div>
										);
									}
								})}{' '}
							</div>
						</Oweners>

						<Oweners>
							Владелец
							<div className="search">
								<TextField
									id="outlined-basic"
									onChange={inputHandler}
									variant="outlined"
									fullWidth
									label="Поиск по организации"
								/>
							</div>
							<div className="own-wrapper">
								<div className="own-list">
									{filteredData?.map((item) => {
										if (item?.deleted == false && item?.enabled == true) {
											return (
												<div key={item?._id} className="own-list__lable">
													<input
														id={item?._id}
														type="radio"
														name="common"
														defaultChecked={item?._id == idWorkUser}
														onClick={() => {
															// console.log(item);
															setNameWorkUser(item?.org);
															setIdWorkUser(item?._id);
														}}
													/>
													<label htmlFor={item?._id}>{item?.org}</label>
												</div>
											);
										}
									})}
								</div>
							</div>
						</Oweners>
						<CheckFilesQuantity
							needPhoto={isCheckFiles.needPhoto}
							manyPhoto={isCheckFiles.manyPhoto}
							manyFiles={isCheckFiles.manyFiles}
						/>

						<button className="accept-btn" type="submit">
							Отправить
						</button>
					</Forma>
				</div>
			)}

			{showModal && (
				<VidiModal id="vidiModal">
					<Modal
						data={listVidi}
						selected={selected}
						setSelected={setSelected}
						selectedText={selectedText}
						setSelectedText={setSelectedText}
						setShowModal={setShowModal}
					/>
				</VidiModal>
			)}
		</Body>
	);
};

export default EditOrder;

const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const ErrMessage = styled.p`
	color: red;
`;

const Oweners = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 50px;
	margin-left: 20px;
	.search {
		margin-top: 20px;
	}
	.own-wrapper {
		display: block;
		max-height: 500px;
		overflow: scroll;
	}
	.own-list {
		columns: 2;
		margin-top: 20px;
		input {
			margin-top: 10px;
		}
		&__lable {
			margin-top: 10px;
			font-size: 16px;
		}
	}
`;

const Body = styled.section`
	display: flex;
	color: black;
	font-family: 'Roboto', sans-serif;
	font-style: normal;
	font-weight: 400;
	.context-wrapper {
		display: flex;
		flex-direction: column;
		padding: 98px 66px 42px;
		max-width: 1200px;
		box-sizing: content-box;
		h2 {
			font-weight: 500;
			font-size: 24px;
			color: #333333;
		}
	}
`;

const Forma = styled.form`
	display: flex;
	flex-direction: column;
	margin-top: 30px;
	width: 100%;
	box-sizing: content-box;
	p {
		font-family: 'Roboto', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 18px;
	}
	.upload {
		display: flex;
		justify-content: space-between;
		margin-top: 40px;
		.input {
			text-align: center;
			height: 175px;
			width: 45%;
			border: 1px solid #bfbfbf;
			border-radius: 5px;
		}
		label {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			font-size: 18px;
			text-align: center;
			color: #bfbfbf;
			cursor: pointer;
			img {
				margin-top: 10px;
			}
		}
		input {
			width: 0.1px;
			height: 0.1px;
			opacity: 0;
			overflow: hidden;
			position: absolute;
			z-index: -1;
		}
	}
	.action {
		display: flex;
		margin-top: 35px;
		font-size: 20px;
		text-decoration-line: underline;
		color: #00aeae;
		border: none;
		background-color: white;
	}
	.preview-wrapper {
		display: flex;
		justify-content: space-between;
		margin-top: 60px;
		.delete-btn {
			width: 18px;
			height: 20px;
			margin-top: 10px;
			border: none;
			background-color: white;
		}
		.preview-place-photo {
			display: flex;
			flex-wrap: wrap;
			gap: 15px;
			margin-top: 10px;
			max-width: 50%;
			.preview-item-photo {
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 180px;
			}
			.preview-img {
				height: 130px;
				cursor: pointer;
				border: 1px solid #00000022;
			}
		}
		.preview-place-file {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			width: 49%;
			gap: 15px;
			max-height: 400px;
			.preview-item-file {
				display: flex;
				flex-direction: column;
				align-items: center;
				max-height: 200px;
			}
			span {
				font-size: 17px;
				text-decoration-line: underline;
				color: #7c7c7c;
				/* cursor: pointer; */
			}
		}
	}
	.toms {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 20px;
		h2 {
			display: flex;
			margin: 0;
			align-items: center;
			font-size: 22px;
		}
		.tom {
			display: flex;
			border: 1px solid #bfbfbf;
			padding: 10px 20px;
			border-radius: 5px;
			align-items: center;
			font-size: 18px;
			color: black;
			height: 20px;
			.close {
				color: black;
				float: right;
				font-size: 40px;
				margin-left: 20px;
			}
			.close:hover,
			.close:focus {
				color: #00aeae;
				text-decoration: none;
				cursor: pointer;
			}
		}
	}
	.short-imput {
		width: 100%;
	}
	select {
		padding: 15px;
		border: 1px solid #bfbfbf;
		border-radius: 5px;
		outline: none;
		width: 100%;
		/* max-width: 590px; */
		color: black;
		background-color: white;
		font-family: 'Roboto', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
	}
	.top {
		display: flex;
		flex-direction: column;
		input {
			padding: 15px;
			border: 1px solid #bfbfbf;
			border-radius: 5px;
			outline: none;
			width: 100%;
			/* max-width: 590px; */
			color: black;
			box-sizing: border-box;
			font-family: 'Roboto', sans-serif;
			font-style: normal;
			font-weight: 400;
			font-size: 16px;
		}
	}
	textarea {
		padding: 15px;
		font-size: 18px;
		color: black;
		border: 1px solid #bfbfbf;
		border-radius: 5px;
		width: 100%;
		height: 200px;
		resize: none;
		outline: none;
		box-sizing: border-box;
		font-family: 'Roboto', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
	}
	.accept-btn {
		display: flex;
		width: 340px;
		height: 67px;
		align-items: center;
		border: none;
		justify-content: center;
		background: #44ad67;
		border-radius: 5px;
		margin: 0 auto;
		margin-top: 89px;
		font-size: 24px;
		color: #ffffff;
	}
`;

const VidiModal = styled.div`
	display: block; /* Hidden by default */
	position: fixed; /* Stay in place */
	z-index: 1; /* Sit on top */
	padding: 100px 0; /* Location of the box */
	left: 0;
	bottom: 0;
	width: 100%; /* Full widtsh */
	height: calc(100% - 70px); /* Full height */
	overflow: auto; /* Enable scroll if needed */
	background-color: rgb(0, 0, 0); /* Fallback color */
	background-color: #000000ae; /* Black w/ opacity */
`;
