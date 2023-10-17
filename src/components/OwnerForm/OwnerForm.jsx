import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
// import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import UserServicePortal from '../../services/UserServicePortal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import classes from './ownerForm.module.css';

const OwnerForm = ({ setOwnerInfo, ownerInfo }) => {
	// const axiosPrivate = useAxiosPrivate();
	const [groupUsers, setGroupUsers] = useState([]);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const [inputText, setInputText] = useState('');

	useEffect(() => {
		const getData = async () => {
			try {
				setMessage('');
				setLoading(true);
				// const response = await axiosPrivate.get('/users_amp');
				const response = await UserServicePortal.fetchUsers();
				setGroupUsers(response.data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				setMessage(error?.response?.data?.message);
			}
		};
		getData();
	}, []);

	const inputHandler = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setInputText(lowerCase);
	};

	const filteredData = groupUsers.filter((el) => {
		if (inputText === '') {
			return el;
		} else {
			return el.org.toLowerCase().includes(inputText);
		}
	});

	return (
		<div className={classes.owner}>
			<div className={classes.legend}>
				Владелец {!!ownerInfo && <p>{ownerInfo?.name}</p>}
			</div>

			<ErrorMessage message={message} />
			{loading ? (
				<div>Загрузка данных</div>
			) : (
				<>
					<div className={classes.search}>
						<TextField
							id="outlined-basic"
							onChange={inputHandler}
							variant="outlined"
							fullWidth
							label="Поиск по организации"
						/>
					</div>
					<div className={classes.ownWrapper}>
						<div className={classes.ownList}>
							{filteredData.map((item) => {
								if (item?.deleted === false && item?.enabled === true)
									return (
										<div key={item?._id} className={classes.ownListLabel}>
											<input
												id={item?._id}
												type="radio"
												name="common"
												defaultChecked={
													!!ownerInfo?.name && item?._id === ownerInfo?._id
														? true
														: false
												}
												onClick={() => {
													setOwnerInfo({ name: item.org, id: item._id });
												}}
											/>
											<label htmlFor={item?._id} className={classes.toLabel}>
												{item?.org}
											</label>
										</div>
									);
							})}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default OwnerForm;
