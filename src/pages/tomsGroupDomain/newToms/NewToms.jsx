import React,{useState, useEffect, useContext} from 'react';
import { useNavigate} from "react-router-dom";
import "./newToms.css"
import TomsGroupService from '../../../services/TomsGroupService';
import TomsService from '../../../services/TomsService';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Layout } from "../../../components/layout/Layout";
import Button from '@mui/material/Button';

const NewToms = () => {

  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [tomsgroup, setTomsgroup] = useState([]);
  const [group, setGroup] = useState(null);

  const [message, setMessage] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    getTomsGroup();
  }, []);

  async function getTomsGroup() {
    try {
      setMessage('')
      const response = await TomsGroupService.fetchWTomsGroup();
      setTomsgroup(response?.data)
    } catch (error) {
      setMessage(error?.response?.data?.message)
    }

  }

  async function createToms (e) {
    try {
      e.preventDefault();
      setMessage('');
      await TomsService.createToms(name, group, enabled);
      navigate('/toms')
    } catch (error) {
      setMessage(error?.response?.data?.message)
      console.error(error.response?.data?.message);
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
                <InputLabel id="group">Группа вида обработки</InputLabel>
                <Select
                  labelId="group"
                  id="group"
                  value={group}
                  label="group"
                  onChange={e => setGroup(e.target?.value)}
                >
                  {tomsgroup?.map(item =>
                    <MenuItem key={item?._id} value={item?._id}>{item?.name_rus}</MenuItem>
                  )}

                </Select>
              </div>
              <div className="newUserItem">
                <InputLabel id="name">Название</InputLabel>
                <TextField id="name" variant="outlined"  
                  onChange={e => setName(e.target?.value)}
                  required
                  value={name}
                />
              </div>
              <div className="newUserItem">
                <InputLabel id="enabled">Активировать</InputLabel>
                <Select
                  labelId="enabled"
                  id="enabled"
                  value={enabled}
                  label="enabled"
                  onChange={e => setEnabled(e.target?.value)}
                >
                  <MenuItem value='true'>да</MenuItem>
                  <MenuItem value='false'>нет</MenuItem>
              </Select>
              </div>
              <button className="userUpdateButton" onClick={(e)=>createToms(e)}>Сохранить изменения</button>
              </div>            
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewToms;