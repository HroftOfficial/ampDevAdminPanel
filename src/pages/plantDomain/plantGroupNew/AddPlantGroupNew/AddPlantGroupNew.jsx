import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantGroupNewService from '../../../../services/PlantGroupNewService';
import { InputLabel, Select, MenuItem } from '@mui/material';
import PlantMainGroupService from '../../../../services/PlantMainGroupService';

import classes from './AddPlantGroupNew.module.css';

const AddPlantGroupNew = () => {
	const [mainGroup, setMainGroup] = useState([]);
	const [group, setGroup] = useState({
		mainGroup: '',
		name: '',
		enabled: true,
	});

	const [message, setMessage] = useState('');

	let navigate = useNavigate();

	async function createPlantGroup(e) {
		try {
			e.preventDefault();
			setMessage('');
			const f_data = new FormData();
			f_data.append('plantGroupAp', group.mainGroup);
			f_data.append('name', group.name);
			f_data.append('enabled', group.enabled);
			// console.log('data', ...f_data);
			// const response = await PlantGroupService.createPlantGroupWitchFile(f_data);
			await PlantGroupNewService.createPlantGroupWitchFile(f_data);
			navigate('/plantGroupsNew');
		} catch (error) {
			setMessage(error?.response?.data?.message);
			console.error(error?.response?.data?.message);
		}
	}

	const handleChange = (e) => {
		setGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	useEffect(() => {
		getPlantsMainGroup();
	}, []);

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
			<div className={classes.newUser}>
				<h1 className={classes.newUserTitle}>Новая группа оборудования</h1>
				<div className={classes.newUserForm}>
					<div className={classes.newUserForm}>
						<div className={classes.newUserItem}>
							<InputLabel id="group">Основная группа оборудования</InputLabel>
							<Select
								labelId="group"
								id="group"
								value={group.mainGroup}
								name="mainGroup"
								label="group"
								onChange={handleChange}
							>
								{mainGroup?.map((item) => (
									<MenuItem key={item?._id} value={item?._id}>
										{item?.name}
									</MenuItem>
								))}
							</Select>
						</div>
						<div className={classes.newUserItem}>
							<label>Название</label>
							<input
								type="text"
								placeholder="Введите название"
								name="name"
								onChange={handleChange}
								required
								value={group.name}
							/>
						</div>
						{/* <div className={classes.newUserItem}>
							<label>Номер для сортировки</label>
							<input
								type="number"
								placeholder="1..."
								name="sortNumber"
								onChange={handleChange}
								required
								value={group.sortNumber}
							/>
						</div> */}
						<div className={classes.newUserItem}>
							<label>Активировать</label>
							<select
								className={classes.newUserSelect}
								name="enabled"
								id="enabled"
								onChange={handleChange}
							>
								<option value="true">Да</option>
								<option value="false">Нет</option>
							</select>
						</div>

						<button
							className={classes.newUserButton}
							onClick={(e) => createPlantGroup(e)}
						>
							Создать
						</button>
					</div>
				</div>
				<div className={classes.newUserErrorMessage}>{message}</div>
			</div>
		</>
	);
};

export default AddPlantGroupNew;
