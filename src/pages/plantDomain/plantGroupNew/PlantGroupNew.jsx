import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import PlantGroupNewService from '../../../services/PlantGroupNewService';
import { AuthContext } from '../../../hoc/AuthProvider';
import config from '../../../settings/config';
import EditButton from '../../../components/CustomButton/EditButton';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GreenSwitch } from '../../../settings/some';
import CircleButton from '../../../components/CustomButton/CircleButton';
import StoreMessage from '../../../components/StoreMessage/StoreMessage';
import renderCellExpand from '../../../components/GridCellExpand/GridCellExpand';

import classes from './PlantGroupNew.module.css';

const PlantGroupNew = () => {
	const { store } = useContext(AuthContext);
	const label = { inputProps: { 'aria-label': 'plant active' } };
	const [plantGroup, setPlantGroup] = useState([]);

	useEffect(() => {
		getPlantsGroup();
	}, []);

	async function getPlantsGroup() {
		try {
			store?.setMessage('');
			store?.setLoading(true);
			const response = await PlantGroupNewService.fetchPlantsGroup();
			setPlantGroup(response?.data);
			console.log(response?.data);
			store?.setLoading(false);
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store?.setLoading(false);
		}
	}

	/**
	 * main
	 */
	const handleChangeEnabled = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await PlantGroupNewService.statePlantPortal(id, checkedValue);
			getPlantsGroup();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	// async function prepareImgChange(id) {
	// 	setCurrentId(id);
	// 	setNewImage(null);
	// 	setOpenImage(true);
	// }

	const columns = [
		{
			field: 'name',
			headerName: 'Название',
			width: 300,
			editable: false,
		},
		// {
		// 	field: 'sortNumber',
		// 	headerName: 'Номер сортировки',
		// 	width: 150,
		// 	editable: false,
		// },
		{
			field: 'enabled',
			headerName: 'Активность',
			type: 'boolean',
			with: 150,
			editable: false,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className={classes.styleButton}>
						<GreenSwitch
							{...label}
							checked={params?.row?.enabled}
							onChange={(event) => handleChangeEnabled(event, params?.row?._id)}
						/>
					</div>
				);
			},
		},
		{
			field: 'mainName',
			headerName: 'Основная группа',
			width: 200,
			editable: false,
			type: 'string',
			renderCell: renderCellExpand,
		},
		// {
		// 	field: 'images',
		// 	headerName: 'Изображение',
		// 	width: 170,
		// 	disableColumnMenu: true,
		// 	headerAlign: 'center',
		// 	renderCell: (params) => {
		// 		return (
		// 			<div className={classes.editCell}>
		// 				{params?.value[0] ? (
		// 					<img
		// 						src={params?.value[0]?.path?.replace(
		// 							/public/i,
		// 							config?.UPLOAD_API_URL
		// 						)}
		// 						alt="logo"
		// 						style={{ width: '60px' }}
		// 					/>
		// 				) : (
		// 					<img src={`${logo}`} alt="logo t" style={{ width: '45px' }} />
		// 				)}
		// 				<div>
		// 					<ChangeImageButton
		// 						handleClick={() => prepareImgChange(params?.row._id)}
		// 					/>
		// 				</div>
		// 			</div>
		// 		);
		// 	},
		// },
		{
			field: 'action',
			headerName: 'Действия',
			width: 150,
			headerAlign: 'center',
			align: 'center',
			cellClassName: 'actionStyle',
			disableColumnMenu: true,
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link
							to={'/plantGroupsNew/' + params?.row._id}
							style={{
								display: 'flex',
								width: '100%',
								justifyContent: 'center',
							}}
						>
							<EditButton />
						</Link>
					</>
				);
			},
		},
	];

	return (
		<>
			<div className={classes.userList}>
				<h1 className={classes.newUserTitle}>Группы оборудования New</h1>
				<StoreMessage />
				<CircleButton link={'/plantGroupsNew/AddPlantGroupNew'} />

				<CustomDataGrid rows={plantGroup} columns={columns} />
			</div>
		</>
	);
};

export default observer(PlantGroupNew);
