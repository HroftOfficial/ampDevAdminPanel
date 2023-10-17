import React, { useEffect, useState } from 'react';
import { FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import WorkGroupService from '../../services/WorkGroupService';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import classes from './accessLevelForm.module.css';

const AccessLevelForm = ({ selected, setSelected }) => {
	const [workGroup, setWorkGroup] = useState([]);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const getData = async () => {
			try {
				setMessage('');
				setLoading(true);
				const responseToms = await WorkGroupService.fetchWorkGroup();
				setWorkGroup(responseToms?.data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				setMessage(error?.response?.data?.message);
			}
		};
		getData();
	}, []);

	const handleSkillChange = (event) => {
		// const index = skills?.indexOf(event.target.value);
		const index = selected?.findIndex((el) => el === event.target.id);
		if (index === -1) {
			setSelected((prevState) => [...prevState, event.target.id]);
		} else {
			setSelected(selected?.filter((skill) => skill !== event.target.id));
		}
	};
	return (
		<>
			<div className={classes.legendToms}>Группа доступа</div>
			<ErrorMessage message={message} />
			{loading ? (
				<div>Загрузка данных</div>
			) : (
				<div className={classes.workGroupArea}>
					{workGroup.map((item) => (
						<FormControlLabel
							sx={{ width: '100%' }}
							key={item._id}
							control={
								<Checkbox
									id={item.access_level}
									name={item?.access_level}
									key={item?.access_level}
									checked={Boolean(
										selected?.find((el) => el === item?.access_level.toString())
									)}
									onChange={handleSkillChange}
								/>
							}
							label={item?.name}
						/>
					))}
				</div>
			)}
		</>
	);
};

export default AccessLevelForm;
