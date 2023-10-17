import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../hoc/AuthProvider";
import classes from "./zakazTelegramList.module.css";
import ZakazService from "../../../services/ZakazService";
import { observer } from "mobx-react-lite";
import logo from './img/no-logo.png';
import Button from '@mui/material/Button';
import renderCellExpand from '../../../components/GridCellExpand/GridCellExpand';
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import ChangeImageButton from "../../../components/CustomButton/ChangeImageButton";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import config from "../../../settings/config";
import {dataURLtoFile} from "../../../utils/cropImage";
import ImageDialog from "../../../components/ImageDialog/ImageDialog";
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";

const ZakazTelegramList = () => {

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  const [open, setOpen] = useState(false);
  
  
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }  
    setOpen(false);
  }



  const { store } = useContext(AuthContext);
  const [zakazes, setZakazes] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [deleteFiles, setDeleteFiles] = useState('');
  
  useEffect(() => {
    getTelegram();
  }, []);

  const handleCloseImage = () => {
    setOpenImage(false);
  }

  async function getTelegram() {
    try {
      store?.setMessage('');
      store?.setLoading(true);
      const response = await ZakazService.fetchZakazes();
      setZakazes(response?.data);
      store?.setLoading(false);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store?.setLoading(false);
    }
  }

  async function prepareImgChange(id, delete_files) {
    setCurrentId(id);
    setDeleteFiles(delete_files);
    setOpenImage(true);
  }

  async function changeImage(imageSrc) {
    try {
      const id = currentId;
      store?.setMessage('');
      const file = dataURLtoFile(imageSrc, "telegram.png");
      store?.setLoading(true);
      const data = new FormData();
      data.append('telegram_url', file);
      data.append('delete_files', deleteFiles);
      const response = await ZakazService.changeImageTelegram(id, data);
      store?.setLoading(false);
      setOpenImage(false);
      getTelegram();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message)
    } finally {
      store?.setLoading(false);
    }
  }



  async function pullTelegram(id) {
    try {
      store?.setMessage('');
      store?.setLoading(true);
      const response = await ZakazService.pullTelegram(id);
      store?.setLoading(false);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message)
    } finally {
      store?.setLoading(false);
    }
  }

  const columns = [
    {
      field: 'number',
      headerName: 'Номер',
      width: 90,
      editable: false,
    },
    {
      field: 'title',
      headerName: 'Название',
      width: 220,
      headerAlign: "center",
      editable: false,
      renderCell: renderCellExpand,
    },
    {
      field: "telegram_url",
      headerName: "Телеграм",
      width: 220,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="editCell">
            {params?.value[0] ? (
              <img
                src={params.value[0]?.path?.replace(
                  /public/i,
                  config?.UPLOAD_API_URL
                )}
                alt="logo"
                style={{ width: "60px" }}
              />
            ) : (
              <img src={`${logo}`} alt="logo t" style={{ width: "45px" }} />
            )}
            <div>
              <ChangeImageButton
                handleClick={() =>
                  prepareImgChange(params?.row?._id,params?.value?.[0]?.filename)
                }
              />
            </div>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "В телеграм",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
              <Button variant="contained" color="primary"
                disabled={params?.row?.deleted || params?.row?.telegram_url?.length === 0}
                onClick={()=>{setOpen(true);pullTelegram(params?.row?._id);}}
                endIcon={<SendIcon />}
              >
                Опубликовать
              </Button>
          </div>
        );
      },
    },
  ];

  const getImage = async(imageSrc) => {
    handleCloseImage();
    await changeImage(imageSrc)
  }

  return (
    <> 
          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Заявка отправлена в телеграм
        </Alert>
      </Snackbar>
    <ImageDialog 
            textDialog={"Выберите фото для Telegram"}
            open={openImage}
            getImage={getImage}
            handleCloseImage={handleCloseImage}
    /> 
         <div className={classes.zakazTelegramList}>
        <h1 className={classes.zakazTelegramTitle}>Заказы Телеграм</h1>
        <StoreMessage />
        <CustomDataGrid
          rows={zakazes}
          columns={columns}
          getRowClassName={(params) => `super-zakaz-t-theme--${params?.row?.deleted}`}
        />
      </div>
    </>
  );
}
export default observer(ZakazTelegramList);