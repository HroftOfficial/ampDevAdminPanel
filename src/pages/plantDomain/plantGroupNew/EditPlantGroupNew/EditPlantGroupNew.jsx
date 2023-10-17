import { useNavigate, useParams } from 'react-router-dom';
import PlantGroupNewService from '../../../../services/PlantGroupNewService';
import PlantMainGroupService from '../../../../services/PlantMainGroupService';
import { InputLabel, Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import config from '../../../../settings/config';

import classes from './EditPlantGroupNew.module.css';

const EditPlantGroupNew = () => {
	const { id } = useParams();
	const [message, setMessage] = useState('');

	const [group, setGroup] = useState({
		name: '',
		enabled: true,
	});

	const [out, setOut] = useState(null);

	const [mainGroup, setMainGroup] = useState([]);

	let location = useNavigate();

	useEffect(() => {
		getItemPlantGroup(id);
		getPlantsMainGroup();
	}, []);

	async function getItemPlantGroup(id) {
		try {
			const response = await PlantGroupNewService.fetchItemPlantGroup(id);
			setGroup(response?.data[0]);
			setOut(response?.data[0]?.mainId);
			console.log('edit', response?.data);
		} catch (error) {
			console.error(error?.response?.data?.message);
		}
	}

	async function updatePlantGroupAll(e) {
		try {
			e.preventDefault();
			const f_data = new FormData();
			f_data.append('plantGroupAp', out);
			f_data.append('name', group.name);
			f_data.append('enabled', group.enabled);
			// console.log('formdata', ...f_data);
			// const response = await PlantGroupService.updateAll(f_data,id);
			await PlantGroupNewService.updateAll(f_data, id);
			location('/plantGroupsNew');
		} catch (error) {
			setMessage(error?.response?.data?.message);
			console.error(error?.response?.data?.message);
		}
	}

	const handleChange = (e) => {
		setGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	async function getPlantsMainGroup() {
		let isMounted = true;
		const controller = new AbortController();
		try {
			const response = await PlantMainGroupService.fetchPlantsMainGroup();
			isMounted && setMainGroup(response?.data);
			// console.log('>>>', response);
		} catch (error) {
			console.error(error?.response?.data?.message);
		} finally {
			isMounted = false;
			controller.abort();
		}
	}

	return (
		<>
			<div className={classes.user}>
				<div className={classes.userTitleContainer}>
					<h1 className={classes.userTitle}>
						Редактировать группу оборудования
					</h1>
				</div>
				<div className={classes.userContainer}>
					<div className={classes.userUpdate}>
						<span className={classes.userUpdateTitle}>Изменить</span>
						<div className={classes.userUpdateForm}>
							<div className={classes.userUpdateLeft}>
								<div className={classes.userUpdateItem}>
									<InputLabel id="out">Основная группа оборудования</InputLabel>
									<Select
										labelId="out"
										id="out"
										value={out}
										label="out"
										onChange={(e) => setOut(e.target?.value)}
									>
										{mainGroup
											?.filter((el) => el.enabled === true)
											.map((item) => (
												<MenuItem key={item?._id} value={item?._id}>
													{item?.name}
												</MenuItem>
											))}
									</Select>
								</div>
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
								{/* <div className={classes.userUpdateItem}>
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
								</div> */}
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

export default EditPlantGroupNew;
