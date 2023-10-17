import React,{useState, useEffect, useContext} from 'react';
import { useNavigate, useParams} from "react-router-dom";
import "./Toms.css"
import TomsGroupService from '../../../services/TomsGroupService';
import TomsService from '../../../services/TomsService';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import config from '../../../settings/config';

const Toms = () => {
  const {id} = useParams();
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [tomsgroup, setTomsgroup] = useState([]);
  const [group, setGroup] = useState(null);

  const [message, setMessage] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    getItemToms(id) 
    getTomsGroup();
  }, []);

  async function getItemToms(id) {
    try {
        const response = await TomsService.fetchItemToms(id);
        setName(response?.data?.name);
        setEnabled(response?.data?.enabled);
        setGroup(response?.data?.tomsgroup_key);
    } catch (error) {
        console.error(error?.response?.data?.message);
        
    }
  }

  async function getTomsGroup() {
    try {
      setMessage('')
      const response = await TomsGroupService.fetchWTomsGroup();
      setTomsgroup(response?.data)
    } catch (error) {
      setMessage(error?.response?.data?.message)
    }

  }

  async function updateTomsAll(e) {
    try {
      e.preventDefault();
      const response = await TomsService.updateAll(name, group, enabled, id)
      navigate('/toms')
      // setAvatar(response?.data[0]?.path?.replace(/public/i, process.env.REACT_APP_API_URL))
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
          <InputLabel id="group">Группа вида обработки</InputLabel>
          <Select
            labelId="group"
            id="group"
            value={group}
            label="group"
            onChange={e => setGroup(e.target?.value)}
          >
            {tomsgroup?.map(item=>
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
              <button className="userUpdateButton" onClick={(e)=>updateTomsAll(e)}>Сохранить изменения</button>
              </div>            
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Toms;