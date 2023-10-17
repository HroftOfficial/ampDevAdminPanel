import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import classes from "./newsList.module.css";
import NewsService from "../../../services/NewsService";
import { AuthContext } from "../../../hoc/AuthProvider";
import renderCellExpand from "../../../components/GridCellExpand/GridCellExpand";
import logo from "./img/no-logo.png";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import config from "../../../settings/config";
import EditButton from "../../../components/CustomButton/EditButton";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import ChangeImageButton from "../../../components/CustomButton/ChangeImageButton";
import { GreenSwitch } from "../../../settings/some";
import CircleButton from "../../../components/CustomButton/CircleButton";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import DeleteButton from "../../../components/CustomButton/DeleteButton";
import DeleteDialog from "../../../components/Dialog/DeleteDialog";
import { dataURLtoFile } from "../../../utils/cropImage";
import CropImageDialog from "../../../components/CropImageDialog/CropImageDialog";

const NewsList = () => {
  const { store } = useContext(AuthContext);
  const label = { inputProps: { "aria-label": "news active" } };
  const [news, setNews] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [newDate, setNewDate] = useState("");
  // const [currentTitle, setCurrentTitle] = useState('');
  const [currentId, setCurrentId] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");

  useEffect(() => {
    getNews();
  }, []);

  async function getNews() {
    try {
      store?.setMessage("");
      store?.setLoading(true);
      const response = await NewsService.fetchNews();
      setNews(response?.data);
      store?.setLoading(false);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store?.setLoading(false);
    }
  }

  const handleChangeEnabled = async (event, id) => {
    try {
      store?.setMessage("");
      const checkedValue = event?.target?.checked;
      await NewsService.stateUserPortal(id, checkedValue);
      getNews();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  };

  async function prepareImgChange(id, title) {
    setCurrentId(id);
    // setCurrentTitle(title);
    // setNewImage(null)
    setOpenImage(true);
  }

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleCloseDate = () => {
    setOpenDate(false);
  };

  async function changeImage(cropImage) {
    try {
      const id = currentId;
      store?.setMessage("");
      // const file = dataURLtoFile(newImage, "news.png");
      const file = dataURLtoFile(cropImage, "news.png");
      store?.setLoading(true);
      const data = new FormData();
      data.append("images", file);
      const response = await NewsService.changeImage(id, data);
      store?.setLoading(false);
      setOpenImage(false);
      getNews();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store?.setLoading(false);
    }
  }

  async function changeDate() {
    try {
      const id = currentId;
      store?.age("");
      const date = newDate;
      store.setLoading(true);
      const response = await NewsService.changeDate(id, date);
      store.setLoading(false);
      setOpenDate(false);
      getNews();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store.setLoading(false);
    }
  }

  async function prepareDateChange(id, date) {
    setCurrentId(id);
    setCurrentDate(date);
    setNewDate(null);
    setOpenDate(true);
  }

  const prepareDelete = async (id, title) => {
    setIdDelete({ id, title });
    setOpen(true);
  };

  const handleDelete = () => {
    deleteNews(idDelete?.id);
    setOpen(false);
  };
  async function deleteNews(id) {
    try {
      store?.setMessage("");
      await NewsService.deleteNews(id);
      getNews();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  }

  const columns = [
    {
      field: "enabled",
      headerName: "Активность",
      type: "boolean",
      with: 150,
      editable: false,
      disableColumnMenu: true,
      headerAlign: "center",
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
      field: "title",
      headerName: "Название",
      width: 300,
      editable: false,
      renderCell: renderCellExpand,
      headerAlign: "center",
    },
    {
      field: "details",
      headerName: "Подробно",
      width: 250,
      editable: false,
      renderCell: renderCellExpand,
      headerAlign: "center",
    },
    {
      field: "news_url",
      headerName: "Изображение",
      width: 220,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      align: "center",
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
                style={{ width: "60px" }}
              />
            ) : (
              <img src={`${logo}`} alt="logo t" style={{ width: "45px" }} />
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
      field: "action",
      headerName: "Действия",
      width: 100,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      cellClassName: "actionStyle",
      renderCell: (params) => {
        return (
          <>
            <Link
              to={"/news/" + params?.row?._id}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <EditButton />
            </Link>
          </>
        );
      },
    },
    {
      field: "action2",
      headerName: "Удалить",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <DeleteButton
            handleClick={() =>
              prepareDelete(params?.row?._id, params?.row?.title)
            }
          />
        );
      },
    },
  ];

  const getCropImage = async (cropImage) => {
    handleCloseImage();
    await changeImage(cropImage);
  };

  return (
    <>
      <DeleteDialog
        textDialog={`Внимание! Вы собираетесь удалить  ${idDelete?.title}.`}
        handle={handleDelete}
        open={open}
        setOpen={setOpen}
      />
      <CropImageDialog
        textDialog={"Выберите фото новости"}
        open={openImage}
        getCropImage={getCropImage}
        handleCloseImage={handleCloseImage}
      />

      <Dialog
        open={openDate}
        onClose={handleCloseDate}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {`Вы собираетесь сменить дату публикации новости с датой ${currentDate}`}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDate}>
            Отменить
          </Button>
          <Button onClick={changeDate}>Cменить дату</Button>
        </DialogActions>
      </Dialog>

      <div className={classes.newsList}>
        <h1 className={classes.newNewsTitle}>Новости</h1>
        <StoreMessage />
        <CircleButton link={"/news/newNews"} />
        <CustomDataGrid
          rows={news}
          columns={columns}
          getRowClassName={(params) =>
            `super-news-theme--${!params?.row?.enabled}`
          }
        />
      </div>
    </>
  );
};

export default observer(NewsList);
