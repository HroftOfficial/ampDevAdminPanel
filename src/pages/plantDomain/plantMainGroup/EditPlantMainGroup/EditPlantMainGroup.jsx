import { useNavigate, useParams } from 'react-router-dom';
import PlantMainGroupService from '../../../../services/PlantMainGroupService';
import { InputLabel, Select, MenuItem } from '@mui/material';
// import {observer} from "mobx-react-lite";
import React, { useEffect, useState } from 'react';
// import { MultiUploader, SingleUploader } from "../../components/uploader/uploader";
import logo from './img/no-logo.png';
import config from '../../../../settings/config';

import classes from './EditPlantMainGroup.module.css';

const EditPlantMainGroup = () => {
	const { id } = useParams();
	// console.log('id', id);
	// const [name, setName] = useState('');
	// const [sortNumber, setSortNumber] = useState('');
	// const [enabled, setEnabled] = useState(true);
	const [message, setMessage] = useState('');

	const [group, setGroup] = useState({
		name: '',
		sortNumber: 10,
		enabled: true,
	});

	const [mainGroup, setMainGroup] = useState([]);

	/**
	 * TODO
	 * update image item group plant state
	 */
	const [images, setImages] = useState(null);
	const [avatar, setAvatar] = useState(null);

	let location = useNavigate();

	async function getItemPlantMainGroup(id) {
		let isMounted = true;
		const controller = new AbortController();
		try {
			const response = await PlantMainGroupService.fetchItemPlantMainGroup(id);
			console.log('data', response?.data);
			isMounted && setGroup(response?.data);
			// setSortNumber(response?.data.sortNumber);
			// setName(response?.data?.name);
			// setEnabled(response?.data?.enabled);
			setAvatar(
				response?.data?.images[0]?.path?.replace(
					/public/i,
					config?.UPLOAD_API_URL
				)
			);
		} catch (error) {
			console.error(error?.response?.data?.message);
		} finally {
			isMounted = false;
			controller.abort();
		}
	}

	useEffect(() => {
		getItemPlantMainGroup(id);
	}, []);

	async function updatePlantGroupAll(e) {
		try {
			e.preventDefault();
			const f_data = new FormData();
			// f_data.append('main_photo_plant', images);
			f_data.append('name', group.name);
			f_data.append('sortNumber', group.sortNumber);
			f_data.append('enabled', group.enabled);
			// const response = await PlantGroupService.updateAll(f_data,id);
			await PlantMainGroupService.updatePlantMainGroup(f_data, id);
			location('/plantMainGroups');
			// setAvatar(response?.data[0]?.path?.replace(/public/i, process.env.REACT_APP_API_URL))
		} catch (error) {
			setMessage(error?.response?.data?.message);
			console.error(error?.response?.data?.message);
		}
	}

	const handleChange = (e) => {
		setGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	return (
		<>
			<div className={classes.user}>
				<div className={classes.userTitleContainer}>
					<h1 className={classes.userTitle}>
						Редактировать основную группу оборудования
					</h1>
				</div>
				<div className={classes.userContainer}>
					{/* <div className={classes.userShow}>
						<div className={classes.logoGroup}>
							{avatar ? (
								<img
									src={`${avatar}`}
									alt="avatar"
									style={{ width: '145px' }}
								/>
							) : (
								<img src={`${logo}`} alt="avatar" style={{ width: '145px' }} />
							)}
						</div>
						<input type="file" onChange={(e) => setImages(e.target.files[0])} />
						<div className={classes.userShowBottom}></div>
						{message}
					</div> */}
					<div className={classes.userUpdate}>
						<span className={classes.userUpdateTitle}>Изменить</span>
						<div className={classes.userUpdateForm}>
							<div className={classes.userUpdateLeft}>
								<div className={classes.userUpdateItem}>
									<label>Название</label>
									<input
										type="text"
										placeholder="токарные станки"
										name="name"
										onChange={handleChange}
										required
										value={group.name}
										className={classes.userUpdateInput}
									/>
								</div>
								<div className={classes.userUpdateItem}>
									<label>Номер сортировки</label>
									<input
										type="number"
										placeholder="1..."
										name="sortNumber"
										onChange={handleChange}
										required
										value={group.sortNumber}
										className={classes.userUpdateInput}
									/>
								</div>
								<div className={classes.userUpdateItem}>
									<label>Активировать </label>
									<select
										className={classes.UserSelect}
										name="enabled"
										id="enabled"
										onChange={handleChange}
										value={group.enabled}
									>
										<option value="false">Нет</option>
										<option value="true">Да</option>
									</select>
								</div>
								<button
									className={classes.userUpdateButton}
									onClick={(e) => updatePlantGroupAll(e)}
								>
									Сохранить изменения
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditPlantMainGroup;
