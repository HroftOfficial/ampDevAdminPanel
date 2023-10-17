import React, { useState, useEffect, useContext } from 'react';
import "./news.css";
import { useNavigate, useParams } from "react-router-dom";
import NewsService from '../../../services/NewsService';
import { AuthContext } from "../../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import MainButton from "../../../components/MainButton/MainButton";
import Button from "@mui/material/Button";
import config from '../../../settings/config';
import ImageDialog from "../../../components/Dialog/ImageDialog";

const News = () => {
  const { store } = useContext(AuthContext);
  const { id } = useParams();


  const [news, setNews] = useState({
    title:"",
    details:''
  });
  
  const handleChange = (e) => {
    setNews((prev) => ({ ...prev, [e.target.name]: e.target?.value }));
  };

  let navigate = useNavigate();

  useEffect(() => {
    getItemNews(id);
  }, []);

  async function getItemNews(id) {
    try {
      store?.setMessage('')
      store?.setLoading(true);
      const response = await NewsService.fetchItemNews(id);
      const data = response?.data;
      console.log(data)
      setNews({title:data?.title, details:data?.details, url: data.news_url[0].filename});
      store?.setLoading(false)
    } catch (error) {
      store?.setMessage(error?.response?.data?.message)
    }
    finally {
      store?.setLoading(false)
    }
  }

  async function saveNews(e) {
    try {
      e.preventDefault();
      store?.setMessage('');
      const response = await NewsService.updateNews(id, news?.title, news?.details);
      navigate('/news')
    } catch (error) {
      store?.setMessage(error?.response?.data?.message)
      console.error(error?.response?.data?.message);
    }
  }

  const [openImage, setOpenImage] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const openWindow = async () => {
    setNewImage(null);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  }; 

  return (
    <>
      <div className="newUser">
        <h1 className="newUserTitle">Редактировать новость</h1>
        <a href='https://html5-editor.net/' target='_blank' rel="noreferrer">HTML редактор(если нужно красиво)</a>
        <StoreMessage />
        <div className="newUserForm">
          <div className="newUserForm">

          <ImageDialog
            textDialog={"Выберите фото"}
            open={openImage}
            handleCloseImage={handleCloseImage}
            newImage={newImage}
            setNewImage={setNewImage}
          />

            <div className="newUserItem">
              <label>Название</label>
              <input
                type="text"
                placeholder="Название новости"
                name='title'
                required
                onChange={handleChange}
                value={news?.title}  
              />
            </div>

            <div className="newUserItem">
              <InputLabel id='info'>Текст новости</InputLabel>
              <TextareaAutosize
                aria-label="info"
                minRows={5}
                name='details'
                onChange={handleChange}
                value={news?.details}  
              />
            </div>

            <div className="newUserItem">
              <InputLabel>Фото</InputLabel>
              <img src={newImage ? newImage : `${config?.UPLOAD_API_URL}/uploads/news/${news.url}`} alt='' style={{marginBottom: '20px'}}/>
              {/* <img src={newImage ? newImage : `${config?.UPLOAD_API_URL}/public/${news.url}`} alt='' style={{marginBottom: '20px'}}/> */}

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
        </div>
        <div className="newUserItem">
        <MainButton handleClick={(e) => saveNews(e)} title={"Сохранить"} />
        </div>
      </div>
    </>
  );
}

export default observer(News);