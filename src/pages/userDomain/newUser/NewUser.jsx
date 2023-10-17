import React,{useState, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { AuthContext } from '../../../hoc/AuthProvider';
import "./newUser.css";
import AuthService from '../../../services/AuthService';
import StoreMessage from '../../../components/StoreMessage/StoreMessage';
import MainButton from '../../../components/MainButton/MainButton';


const NewUser = () => {
  const {store} = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [enabled, setEnabled] = useState(false);

  let navigate = useNavigate();

  async function createUserAdm(name, email, position, password,enabled) {
    try {
      store?.setMessage('')
      await AuthService.registration(name, email, position, password,enabled);
      navigate('/users')
    } catch (error) {
      store?.setMessage(error?.response?.data?.message)
    }
  }


  return (
    <>
    <div className="newUser">
      <h1 className="newUserTitle">Новый пользователь (АДМ)</h1>
      <StoreMessage />
      <div className="newUserForm">
      <div className="newUserForm">
        <div className="newUserItem">
          <label>ФИО</label>
          <input 
            type="text" 
            placeholder="Иванов И.И." 
            name='name' 
            onChange={e => setName(e.target?.value)}
            required
            value={name}
          />
        </div>

        <div className="newUserItem">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="john@gmail.com" 
            name='email'
            onChange={e => setEmail(e.target?.value)}
            required
            value={email}
          />
        </div>

        <div className="newUserItem">
          <label>Должность</label>
          <input 
            type="text" 
            placeholder="менеджер" 
            name='position'
            onChange={e => setPosition(e.target?.value)}
            required
            value={position}
          />
        </div>

        <div className="newUserItem">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="пароль" 
            name='password'
            onChange={e => setPassword(e.target?.value)}
            required
            value={password}
          />
        </div>

        <div className="newUserItem">
          <label>Активировать</label>
          <select className="newUserSelect" name="active" id="active"
            onChange={e => setEnabled(e.target?.value)}
          >
            <option value="false">Нет</option>
            <option value="true">Да</option>
          </select>
        </div>

        <div className="newUserItem">
          <MainButton handleClick={()=>createUserAdm(name, email, position, password, enabled)} title={'Создать'}/>
        </div>
        
        </div>
      </div>
    </div>
    </>
  );
}

export default observer(NewUser);