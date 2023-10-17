import "./zakazEditList.css";
import { DataGrid, ruRU } from '@mui/x-data-grid';
import { DeleteOutline, RestoreFromTrashOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Layout } from '../../../../components/layout/Layout';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ZakazService from "../../../../services/ZakazService";
// import { Context } from "../../../index";
import { AuthContext } from "../../../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";
import logo from './img/no-logo.png';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import renderCellExpand from '../../../../components/GridCellExpand/GridCellExpand';
import Cropper from 'react-easy-crop'
import { cities } from '../../../../utils/only_cities2';
import  getCroppedImg  from "../../../../utils/cropImage";


// import DialogCities from "../../../components/dialogCities/DialogCities";

const ZakazEditList = () => {
  const { store } = useContext(AuthContext);
  const [zakazes, setZakazes] = useState([]);
  const [pageEditSize, setEditPageSize] = useState(store.usersAmpEditPageSize || 10);
  const [pageSettingsSize, setSettingsPageSize] = useState(store.usersAmpSettingsPageSize || 10);

  const [message, setMessage] = useState('');

  const [open, setOpen] = React.useState(false);
  const [openCities, setOpenCities] = useState(false);


  const [selectCity, setSelectCity] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const [currentEmail, setCurrentEmail] = useState('');
  const [currentOrg, setCurrentOrg] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentCities, setCurrentCities] = useState('');


  const [crop, setCrop] = useState({ x: 0, y: 0 })

  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const handleClose = () => {
    setOpen(false);
  };


  const handleCloseCities = () => {
    setOpenCities(false);
  }

  const handleCloseImage = () => {
    setOpenImage(false);
  }

  useEffect(() => {
    getUsers();
  }, []);


  async function getUsers() {
    try {
      setMessage('');
      store.setLoading(true);
      const response = await ZakazService.fetchZakazes();
      setZakazes(response?.data);
      store.setLoading(false);
    } catch (error) {
      setMessage(error?.response?.data?.message);
    } finally {
      store.setLoading(false);
    }
  }

  async function userDelete(id) {
    try {
      const enabled = false;
      const deleted = true;
      const response = await ZakazService.stateUserAmp(id, enabled, deleted);
      getUsers()
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  };

  async function userRestore(id) {
    try {
      const enabled = true;
      const deleted = false;
      const response = await ZakazService.stateUserAmp(id, enabled, deleted);
      getUsers()
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  }

  async function stateService(id, service) {
    try {
      const response = await ZakazService.stateService(id, service);
      getUsers()
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  }

  async function stateEditPageSize(newPageSize) {
    store.setUsersAmpEditPageSize(newPageSize);
    setEditPageSize(newPageSize);
  }
  async function stateSettingsPageSize(newPageSize) {
    store.setUsersAmpSettingsPageSize(newPageSize);
    setSettingsPageSize(newPageSize);
  }

  async function prepareChangePassword(id, email, org) {
    setCurrentEmail(email);
    setCurrentOrg(org);
    setCurrentId(id);
    setOpen(true);
  }

  async function prepareCitiesChange(id, org, cities) {
    setCurrentId(id);
    setCurrentOrg(org);
    setCurrentCities(cities);
    setSelectCity(null)
    setOpenCities(true);
  }

  async function prepareImgChange(id, org) {
    setCurrentId(id);
    setCurrentOrg(org);
    setNewImage(null)
    setOpenImage(true);
  }

  async function changePassword() {
    try {
      setMessage('');
      const response = await ZakazService.changePassword(currentId, currentEmail);
      setOpen(false);
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }finally{
      setOpen(false);
    }
  }

  async function handleChangeCities() {
    try {
      const id = currentId;
      const cities = selectCity.value;
      setMessage('');
      store.setLoading(true);
      const response = await ZakazService.changeCities(id, cities);
      store.setLoading(false);
      setOpenCities(false);
      getUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message)
    }finally{
      store.setLoading(false);
    } 
  }

  // helper function: generate a new file from base64 String
const dataURLtoFile = (dataUrl, filename) => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1)
    n -= 1 // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime })
}

  async function changeImage () {
    try {
      const id = currentId;
      setMessage('');
      const base64Data = await getCroppedImg(newImage, croppedArea);
      const file = dataURLtoFile(base64Data, 'logo.jpg')
      store.setLoading(true);
      const data = new FormData();
      data.append('images', file);
      const response = await ZakazService.changeImage(id, data);
      store.setLoading(false);
      setOpenImage(false);
      getUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message)
    }finally{
      store.setLoading(false);
    }
  }


const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
  console.dir(croppedAreaPixels)
  setCroppedArea(croppedAreaPixels)
}

const onSelectFile = (event) => {
  if(event?.target?.files && event?.target?.files?.length > 0) {
    const reader = new FileReader();
    reader.onload = function() {
      var image = new Image();
  
      image.src = reader.result;
  
      image.onload = function() {
        if(image.width < 350){
          alert(`картинка слишком маленькая ${image.width}px. Найди другую картинку!`);
        }
      };
  
  };
    reader.readAsDataURL(event?.target?.files[0]);
    reader.addEventListener("load",()=>{
      setNewImage(reader?.result)
    });
  }
}

  const columns = [
    {
      field: 'number',
      headerName: 'номер закза',
      width: 180,
      editable: false,
      // renderCell: renderCellExpand,
    },
    {
      field: 'title',
      headerName: 'название',
      width: 200,
      editable: false,
    },
    {
      field: 'details',
      headerName: 'описание',
      width: 300,
      editable: false,
      renderCell: renderCellExpand,
    },
    {
      field: 'cities',
      headerName: 'Город',
      width: 200,
      editable: false,
      renderCell:(params) => {
        return(
          <div className="editCell">  
          <div>
            {params.value}
            </div>    
            <div>
              <button onClick={() =>prepareCitiesChange(params.row._id, params.row.org, params.row.cities )}>
              <EditIcon fontSize="large" />
              </button>
              </div>      
            </div>
        )
      }
    },

    {
      field: "action",
      headerName: "Действия",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="allEditCell">
            <Link to={"/userAmp/" + params.row._id}>
              {/* <EditIcon fontSize="large" /> */}
              <button
            className="userPasswordButton">
            редактировать
          </button>
            </Link>
          </div>
        );
      },
    },

  ];

  return (
    <>
      <Dialog open={openCities} onClose={handleCloseCities}>
        <DialogTitle>Изменение населенного пункта</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы собираетесь изменить населенный пункт <span className='citiesInfoTitle'>{currentCities}</span> для организации <span className='citiesInfoTitle'>{currentOrg}</span>
          </DialogContentText>
          <div className='newUserItem'>
          <Autocomplete
            id="nba teams"
            options={cities}
            renderInput={params => (
              <TextField {...params} label="выбирите город" variant="outlined" />
            )}
            getOptionLabel={option => option.value}
            style={{ width: 270 }}
            value={selectCity}
            onChange={(_event, newCity) => {
              setSelectCity(newCity);
            }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCities}>Отмена</Button>
          <Button onClick={handleChangeCities}>Сохранить</Button>
        </DialogActions>
      </Dialog>



      <div className="userList">
        <h1 className="newUserTitle">Редактирование заказов</h1>
            <div className="userListCreateWrapper2">
              <Link to="/newUserAmp">
                <button className="userAddButtonList">Создать</button>
              </Link>
            </div>
            <div style={{ height: 650, width: '90%' }}>
              <DataGrid
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                loading={store.isLoading}
                initialState={{
                  sorting: {
                    sortModel: store.usersAmpEditSort,
                  },
                  filter: {
                    filterModel: {
                      items: store.usersAmpEditFilter
                    },
                  },
                  pagination: {
                    page: store.usersAmpEditPage,
                    pageSize: store.usersAmpEditPageSize
                  },
                }}
                getRowId={(row) => row._id}
                rows={zakazes}
                columns={columns}
                onPageSizeChange={(newPageSize) => stateEditPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20]}
                pageSize={pageEditSize}
                onSortModelChange={(e) => store.setUsersAmpEditSort(e)}
                onFilterModelChange={(e) => store.setUsersAmpEditFilter(e?.items)}
                onPageChange={(e) => store.setUsersAmpEditPage(e)}
              />
              <div className="newUserErrorMessage">
                {message}
              </div>
              
            </div>
      </div>
    </>
  );
}

export default observer(ZakazEditList);
