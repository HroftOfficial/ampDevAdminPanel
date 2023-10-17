import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import NewsService from '../../../services/NewsService';
import { AuthContext } from "../../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import MainButton from "../../../components/MainButton/MainButton";
import classes from "./news.module.css"

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
      setNews({title:data?.title, details:data?.details});
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

  return (
    <>
      <div className={classes.newNews}>
        <h1 className={classes.newNewsTitle}>Редактировать новость</h1>
        <a href='https://html5-editor.net/' target='_blank' rel="noreferrer">HTML редактор(если нужно красиво)</a>
        <StoreMessage />
          <div>
            <div className={classes.newNewsItem}>
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

            <div className={classes.newNewsItem}>
              <InputLabel id='info'>Текст новости</InputLabel>
              <TextareaAutosize
                aria-label="info"
                minRows={5}
                name='details'
                onChange={handleChange}
                value={news?.details}  
              />
            </div>
          </div>
        <div className={classes.newNewsItem}>
        <MainButton handleClick={(e) => saveNews(e)} title={"Сохранить"} />
        </div>
      </div>
    </>
  );
}

export default observer(News);