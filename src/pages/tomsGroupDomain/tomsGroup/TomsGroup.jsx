import React,{useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "./tomsGroup.css";
import TomsGroupService from "../../../services/TomsGroupService";
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

const TomsGroup = ()=> {
  const {id} = useParams();
  const [name_rus, setName_rus] = useState('');
  const [name_eng, setName_eng] = useState('');
  const [message, setMessage] = useState('');

  let location = useNavigate();

  useEffect(() => {
    getItemTomsGroup(id);
  },[id]);

  async function getItemTomsGroup(id) {
    try {
        const response = await TomsGroupService.fetchItemTomsGroup(id);
        setName_rus(response?.data.name_rus);
        setName_eng(response?.data?.name_eng);
    } catch (error) {
        console.error(error?.response?.data?.message);
        
    }
  }

async function updateTomsGroup(e) {
  try {
    e.preventDefault();
    const response = await TomsGroupService.updateTomsGroup(id,name_rus,name_eng)
    location('/tomsGroup')
  } catch (error) {
    setMessage(error?.response?.data?.message)
    console.error(error?.response?.data?.message);
  }

}
  return (
    <>
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Редактировать группу обработки</h1>
      </div>
      <div className="userContainer">
        <div className="userUpdate">
          {message}
          <span className="userUpdateTitle">Изменить</span>
          <div className="userUpdateForm">
            <div className="userUpdateLeft">

            <div className="newUserItem">
              <InputLabel id="name">Название rus</InputLabel>
              <TextField id="name" variant="outlined"  
                onChange={e => setName_rus(e.target.value)}
                required
                value={name_rus}
              />
            </div>
            <div className="newUserItem">
              <InputLabel id="name">Название eng</InputLabel>
              <TextField id="name" variant="outlined"  
                onChange={e => setName_eng(e.target.value)}
                required
                value={name_eng}
              />
            </div>
              <button className="userUpdateButton" onClick={(e)=>updateTomsGroup(e)}>Сохранить изменения</button>
              </div>            
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TomsGroup;