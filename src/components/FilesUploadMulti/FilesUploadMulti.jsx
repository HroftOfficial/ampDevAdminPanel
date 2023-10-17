import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import config from '../../settings/config';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// import config from "../../../config/config";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
// import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { useDropzone } from 'react-dropzone';

import classes from './fileUploadMulti.module.css';

const { MAX_FILE, UPLOAD_API_URL } = config;

const FilesUploadMulti = ({
	plant,
	selectIndex,
	setSelectIndex,
	files,
	setFiles,
	variant = 1,
	handleDeleteFile,
	subject,
	allowedFiles,
	pathFileUpload,
	// id,
	// deletedPath,
	// setDeletedPath,
}) => {
	// const axiosPrivate = useAxiosPrivate();
	const location = useLocation();
	const navigate = useNavigate();
	const [errMsg, setErrMsg] = useState('');
	const errRef = useRef();

	const [, setUpdate] = useState();

	const draftNum = plant?.length;
	const [errors, setErrors] = useState('');
	const { getRootProps, getInputProps } = useDropzone({
		accept: allowedFiles,
		maxFiles: MAX_FILE - draftNum,
		onDrop: (acceptedFiles, fileRejections) => {
			setErrors('');
			const newFile = acceptedFiles.map((file) =>
				Object.assign(file, { preview: URL.createObjectURL(file) })
			);
			setFiles((prevState) => [...prevState, ...newFile]);
			// setErrors('');
			// setFiles([
			// 	acceptedFiles.map((file) =>
			// 		Object.assign(file, {
			// 			preview: URL.createObjectURL(file),
			// 		})
			// 	),
			// ]);

			fileRejections.forEach((file) => {
				file.errors.forEach((err) => {
					if (err.code === 'file-too-large') {
						setErrors(`Error: ${err.message}`);
					}

					if (err.code === 'file-invalid-type') {
						setErrors(`Error: ${err.message}`);
					}

					if (err.code === 'too-many-files') {
						setErrors(`Внимание: вы пытаетесь загрузить слишком много файлов`);
					}
				});
			});
		},
	});

	const removeFile = (file) => () => {
		const newFiles = [...files];
		newFiles.splice(newFiles.indexOf(file), 1);
		setFiles(newFiles);
	};

	const removeAll = () => {
		setFiles([]);
	};

	// const handleDeleteFile = async (event, path) => {
	//   event.preventDefault();
	//   console.log(path);
	//   const f_data = new FormData();

	//   f_data.append("filename", path);
	//   console.log(...f_data);
	//   let isMounted = true;
	//   const controller = new AbortController();
	//   try {
	//     await axiosPrivate.post(`${ZAKAZES_URL}/delete_file/${id}`, f_data, {
	//       withCredentials: true,
	//       signal: controller.signal,
	//     });
	//     isMounted && setUpdate();
	//   } catch (err) {
	//     if (!err?.response) {
	//       setErrMsg("Нет ответа сервера");
	//     } else if (err.response?.status === 500) {
	//       setErrMsg(`Ошибка: ${err?.response?.data?.message}`);
	//     } else if (err.response?.status === 401) {
	//       navigate("/login", { state: { from: location }, replace: true });
	//     } else if (err.response?.status === 400) {
	//       setErrMsg(`Ошибка: ${err?.response?.data?.message}`);
	//     } else {
	//       setErrMsg("Неизвестная ошибка");
	//     }
	//     errRef.current.focus();
	//     console.error(err);
	//   } finally {
	//     isMounted = false;
	//   }
	// };

	useEffect(() => {
		return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, []);
	// console.log(classes)
	return (
		<>
			<div className={classes.wrapper}>
				<div className={classes.info}>
					<div style={{ color: 'red' }}>{errors}</div>
					<div> Всего доступно {MAX_FILE} файлов для загрузки. </div>
					<div>
						У {subject} {plant?.length}{' '}
						{variant === 1 ? <span>чертежа(ей)</span> : <span>файла(ов)</span>}.
					</div>
					{MAX_FILE - plant?.length && (
						<>
							<div className={classes.addInfo}>
								<span>
									Вы можете добавить еще {MAX_FILE - draftNum - files?.length}{' '}
									{variant === 1 ? (
										<span>чертежа(ей)</span>
									) : (
										<span>файла(ов)</span>
									)}
								</span>
								<section className="container">
									{/* <div {...getRootProps({ className: "dropzone" })}> */}
									<div {...getRootProps({ className: `${classes.dropzone}` })}>
										<input {...getInputProps()} />
										<div className={classes.iconUploadBlock}>
											<UploadFileIcon fontSize="large" />
										</div>
									</div>
									{files.length > 0 && (
										<div className={classes.removeButton}>
											<Button
												variant="contained"
												color="error"
												onClick={removeAll}
											>
												Удалить все
											</Button>
										</div>
									)}
								</section>
							</div>
							<div className={classes.viewBlock}>
								{files?.length > 0 && (
									<div className={classes.serverTitle}>
										Добавляем к {subject}
									</div>
								)}
								<div className={classes.imageBlock}>
									{files.map((file) => (
										<div className={classes.imageWrapper} key={file.name}>
											{variant === 1 && (
												<img
													src={file.preview}
													className={classes.img}
													onLoad={() => {
														URL.revokeObjectURL(file.preview);
													}}
												/>
											)}

											<span key={file.path}>
												{file.path} ~ {Math.round(file.size / 1024)} kb{' '}
											</span>
											<div className={classes.buttonBlock}>
												<Button
													variant="contained"
													color="error"
													onClick={removeFile(file)}
												>
													Удалить файлы
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>
						</>
					)}
				</div>
				{plant && (
					<div className={classes.viewBlock}>
						{plant?.length > 0 && (
							<div className={classes.serverTitle}>Присутсвует в {subject}</div>
						)}
						<p
							ref={errRef}
							className={errMsg ? classes.errmsg : 'offscreen'}
							aria-live="assertive"
						>
							{errMsg}
						</p>
						<div className={classes.imageBlock}>
							{plant?.map((item, index) => (
								<div
									className={classes.imageWrapper}
									key={index}
									id={item?.filename}
								>
									{variant === 1 && (
										<img
											id={index}
											// src={
											// 	UPLOAD_API_URL + '/uploads/plant_ap/' + item?.filename
											// }
											src={
												UPLOAD_API_URL + `${pathFileUpload}` + item?.filename
											}
											alt={index}
											onClick={(event) => setSelectIndex(event.target.id)}
											className={
												selectIndex == index
													? (classes.imageZakaz, classes.selectImage)
													: classes.imageZakaz
											}
										/>
									)}
									<span>{item?.filename}</span>
									<div className={classes.buttonBlock}>
										<Button
											variant="contained"
											color="error"
											// onClick={(event) => handleDeleteFile(event, item?.path)}
											onClick={() => handleDeleteFile(item?.filename)}
										>
											удалить
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default FilesUploadMulti;
