import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../hoc/AuthProvider';
import config from '../../../settings/config';
import EditButton from '../../../components/CustomButton/EditButton';
import CustomDataGrid from '../../../components/CustomDataGrid/CustomDataGrid';
import { GreenSwitch } from '../../../settings/some';
import CircleButton from '../../../components/CustomButton/CircleButton';
import StoreMessage from '../../../components/StoreMessage/StoreMessage';
import ChangeImageButton from '../../../components/CustomButton/ChangeImageButton';
import CropImageDialog from '../../../components/CropImageDialog/CropImageDialog';
import PlantMainGroupService from '../../../services/PlantMainGroupService';
import { dataURLtoFile } from '../../../utils/cropImage';
import logo from './img/no-logo.png';

import classes from './PlantMainGroup.module.css';

export const PlantMainGroup = () => {
	const { store } = useContext(AuthContext);
	const label = { inputProps: { 'aria-label': 'plant active' } };
	const [plantMainGroup, setPlantMainGroup] = useState([]);

	const [openImage, setOpenImage] = useState(false);
	const [currentId, setCurrentId] = useState('');

	useEffect(() => {
		getPlantsMainGroup();
	}, []);

	async function getPlantsMainGroup() {
		try {
			store?.setMessage('');
			store?.setLoading(true);
			const response = await PlantMainGroupService.fetchPlantsMainGroup();
			setPlantMainGroup(response?.data);
			// console.log('>>>', response);
			store?.setLoading(false);
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store?.setLoading(false);
		}
	}

	const handleChangeEnabled = async (event, id) => {
		try {
			store?.setMessage('');
			const checkedValue = event?.target?.checked;
			await PlantMainGroupService.statePlantMainPortal(id, checkedValue);
			getPlantsMainGroup();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		}
	};

	async function changeImage(cropImage) {
		try {
			const id = currentId;
			store?.setMessage('');
			// const file = dataURLtoFile(newImage, "news.png");
			const file = dataURLtoFile(cropImage, 'news.png');
			console.log('file', file);
			store?.setLoading(true);
			const data = new FormData();
			data.append('main_photo_plant', file);

			const response = await PlantMainGroupService.changeImage(id, data);
			store?.setLoading(false);
			setOpenImage(false);
			getPlantsMainGroup();
		} catch (error) {
			store?.setMessage(error?.response?.data?.message);
		} finally {
			store?.setLoading(false);
		}
	}

	async function prepareImgChange(id, title) {
		setCurrentId(id);
		// setCurrentTitle(title);
		// setNewImage(null)
		setOpenImage(true);
	}

	const handleCloseImage = () => {
		setOpenImage(false);
	};

	const getCropImage = async (cropImage) => {
		handleCloseImage();
		await changeImage(cropImage);
	};

	const columns = [
		{
			field: 'name',
			headerName: 'Название',
			width: 300,
			editable: false,
		},
		{
			field: 'sortNumber',
			headerName: 'Номер сортировки',
			width: 150,
			editable: false,
		},
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
					<div className="styleButton">
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
			field: 'images',
			headerName: 'Изображение',
			width: 170,
			disableColumnMenu: true,
			headerAlign: 'center',
			renderCell: (params) => {
				return (
					<div className={classes.editCell}>
						{params?.value[0] ? (
							<img
								src={params.value[0]?.path?.replace(
									/public/i,
									config?.UPLOAD_API_URL
								)}
								alt="logo"
								style={{ width: '60px' }}
							/>
						) : (
							<img src={`${logo}`} alt="logo t" style={{ width: '45px' }} />
						)}
						<ChangeImageButton
							handleClick={() =>
								prepareImgChange(params?.row?._id, params?.row?.title)
							}
						/>
					</div>
				);
			},
		},

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
							to={'/plantMainGroups/' + params?.row._id}
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
			<CropImageDialog
				textDialog={'Выберите фото группы'}
				open={openImage}
				getCropImage={getCropImage}
				handleCloseImage={handleCloseImage}
			/>
			<div className="userList">
				<h1 className="newUserTitle">Основные группы оборудования</h1>
				<StoreMessage />
				<CircleButton link={'/plantMainGroups/addPlantMainGroup'} />

				<CustomDataGrid rows={plantMainGroup} columns={columns} />
			</div>
		</>
	);
};
