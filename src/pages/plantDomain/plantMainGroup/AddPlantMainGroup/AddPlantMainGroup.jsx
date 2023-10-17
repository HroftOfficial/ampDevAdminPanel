import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantMainGroupService from '../../../../services/PlantMainGroupService';

import classes from './AddPlantMainGroup.module.css';

const AddPlantMainGroup = () => {
	const [mainGroup, setMainGroup] = useState({
		name: '',
		sortNumber: 0,
		enabled: true,
	});
	// const [name, setName] = useState('');
	// const [sortNumber, setSortNumber] = useState(0);
	// const [enabled, setEnabled] = useState(true);
	const [images, setImages] = useState(null);

	const [message, setMessage] = useState('');

	let navigate = useNavigate();

	async function createPlantMainGroup(e) {
		try {
			e.preventDefault();
			setMessage('');
			const f_data = new FormData();
			f_data.append('main_photo_plant', images);
			f_data.append('name', mainGroup.name);
			f_data.append('sortNumber', mainGroup.sortNumber);
			f_data.append('enabled', mainGroup.enabled);
			console.log('form data', ...f_data);

			// const response = await PlantGroupService.createPlantGroupWitchFile(f_data);
			await PlantMainGroupService.createPlantMainGroup(f_data);
			navigate('/plantMainGroups');
		} catch (error) {
			setMessage(error?.response?.data?.message);
			console.error(error?.response?.data?.message);
		}
	}

	const handleChange = (e) => {
		setMainGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	return (
		<>
			<div className={classes.newUser}>
				<h1 className={classes.newUserTitle}>
					Новая основная группа оборудования
				</h1>
				<form className={classes.newUserForm} onSubmit={createPlantMainGroup}>
					<div className={classes.newUserForm}>
						<div className={classes.newUserItem}>
							<label>Название</label>
							<input
								type="text"
								placeholder="Введите название"
								name="name"
								onChange={handleChange}
								required
								value={mainGroup.name}
							/>
						</div>
						<div className={classes.newUserItem}>
							<label>Номер для сортировки</label>
							<input
								type="number"
								placeholder="1..."
								name="sortNumber"
								onChange={handleChange}
								required
								value={mainGroup.sortNumber}
							/>
						</div>
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
						<div className={classes.newUserItem}>
							<label>Фото</label>
							<input
								type="file"
								name="images"
								onChange={(e) => setImages(e.target.files[0])}
								required
							/>
						</div>
						<button
							className={classes.newUserButton}
							// onClick={(e) => createPlantMainGroup(e)}
						>
							Создать
						</button>
					</div>
				</form>
				<div className={classes.newUserErrorMessage}>{message}</div>
			</div>
		</>
	);
};

export default AddPlantMainGroup;
