import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import classes from "./newNews.module.css"
import NewsService from "../../../services/NewsService";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import MainButton from "../../../components/MainButton/MainButton";
import { AuthContext } from "../../../hoc/AuthProvider";
import { dataURLtoFile } from "../../../utils/cropImage";
import CropImageDialog from "../../../components/CropImageDialog/CropImageDialog";

const NewNews = () => {
  const { store } = useContext(AuthContext);
  const [openImage, setOpenImage] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const [news, setNews] = useState({
    title: "",
    details: "",
  });

  const handleChange = (e) => {
    setNews((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  let navigate = useNavigate();

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  async function createNews(e) {
    try {
      e.preventDefault();
      store?.setMessage("");
      const file = dataURLtoFile(newImage, "news.png");
      const f_data = new FormData();
      f_data.append("images", file);
      f_data.append("title", news?.title);
      f_data.append("details", news?.details);
      const response = await NewsService.createNews(f_data);
      navigate("/news");
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
      console.error(error?.response?.data?.message);
    }
  }

  const openWindow = async () => {
    setNewImage(null);
    setOpenImage(true);
  };

  const getCropImage = (cropImage) => {
    setNewImage(cropImage);
    handleCloseImage();
  };

  return (
    <>
      <CropImageDialog
        textDialog={"Выберите фото новости"}
        open={openImage}
        getCropImage={getCropImage}
        handleCloseImage={handleCloseImage}
      />

      <div className={classes.newNews}>
        <h1 className={classes.newNewsTitle}>Создать новость</h1>
        <StoreMessage />
        <div>
            <div className={classes.newNewsItem}>
              <label>Название</label>
              <input
                type="text"
                placeholder="Название новости"
                name="title"
                required
                onChange={handleChange}
                value={news?.name}
              />
            </div>

            <div className={classes.newNewsItem}>
              <InputLabel id="info">Текст новости</InputLabel>
              <TextareaAutosize
                aria-label="info"
                minRows={5}
                name="details"
                onChange={handleChange}
                value={news?.details}
              />
            </div>
            <div className={classes.newNewsItem}>
              <InputLabel>Фото</InputLabel>
              {newImage && 
              <img src={newImage} alt="crop" />
              }

              <Button
                variant="contained"
                component="span"
                className="imageButton"
                onClick={(e) => openWindow()}
              >
                Загрузить фото новости
              </Button>
            </div>
        </div>
        <div className={classes.newNewsItem}>
          <MainButton handleClick={(e) => createNews(e)} title={"Создать"} />
        </div>
      </div>
    </>
  );
};

export default observer(NewNews);