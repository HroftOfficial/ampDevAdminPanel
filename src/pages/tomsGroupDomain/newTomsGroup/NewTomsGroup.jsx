import React,{useState} from 'react';
import { useNavigate} from "react-router-dom";
import "./newTomsGroup.css"
import TomsGroupService from '../../../services/TomsGroupService';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { Layout } from "../../../components/layout/Layout";

const NewTomsGroup = () => {

  const [name_rus, setName_rus] = useState('');
  const [name_eng, setName_eng] = useState('');

  const [message, setMessage] = useState('');

  let navigate = useNavigate();

  async function createTomsGroup (e) {
    try {
      e.preventDefault();
      setMessage('');
      await TomsGroupService.createTomsGroup(name_rus, name_eng);
      navigate('/tomsGroup')
    } catch (error) {
      setMessage(error?.response?.data?.message)
      console.error(error?.response?.data?.message);
    }
  }


  return (
    <>
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Создать группу обработки</h1>
      </div>
      <div className="userContainer">
        <div className="userUpdate">
          {message}
          <span className="userUpdateTitle">Создать</span>
          <div className="userUpdateForm">
            <div className="userUpdateLeft">

              <div className="newUserItem">
                <InputLabel id="name">Название rus</InputLabel>
                <TextField id="name" variant="outlined"  
                  onChange={e => setName_rus(e.target?.value)}
                  required
                  value={name_rus}
                />
              </div>
              <div className="newUserItem">
                <InputLabel id="name">Название eng</InputLabel>
                <TextField id="name" variant="outlined"  
                  onChange={e => setName_eng(e.target?.value)}
                  required
                  value={name_eng}
                />
              </div>
              <button className="userUpdateButton" onClick={(e)=>createTomsGroup(e)}>Сохранить изменения</button>
              </div>            
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewTomsGroup;