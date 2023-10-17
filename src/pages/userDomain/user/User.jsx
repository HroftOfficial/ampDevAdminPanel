import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import "./user.css";
import AuthService from "../../../services/AuthService";
import { AuthContext } from "../../../hoc/AuthProvider";
import config from "../../../settings/config";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";

const User = () => {
  const { store } = useContext(AuthContext);
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(false);
  let location = useNavigate();

  useEffect(() => {
    getItemUsers(id);
  }, [id]);

  async function getItemUsers(id) {
    try {
      store?.setMessage("");
      const response = await AuthService.fetchItemUser(id);
      setUser(response?.data);
      setName(response?.data?.name);
      setEmail(response?.data?.email);
      setPosition(response?.data?.position);
      setEnabled(response?.data?.enabled);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  }

  async function updateUserAdm(name, email, position, enabled) {
    try {
      store?.setMessage("");
      await AuthService.update(name, email, position, enabled, id);
      location(`/${config?.adminPrefix}`);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  }

  async function changePassword(password) {
    try {
      store?.setMessage("");
      await AuthService.changePassword(password, id);
      location(`/${config?.adminPrefix}`);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  }
  return (
    <>
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Редактировать пользователя(АДМ)</h1>
        </div>
        <StoreMessage />
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <div>
                <span className="userShowUsername">{user?.name}</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Инфо пользователя</span>
              <div className="userShowInfo">
                <div>Email: </div>
                <span className="userShowInfoTitle2">{user?.email}</span>
              </div>
              <div className="userShowInfo">
                <div>Должность: </div>
                <span className="userShowUserTitle2">{user?.position}</span>
              </div>
              <div className="userShowInfo">
                <span className="userShowUserTitle2">
                  {user.enabled ? "активирован" : "не активирован"}
                </span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitlePassword">Смена пароля</span>
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Новый пароль</label>
                  <input
                    type="password"
                    placeholder="придумай хороший пароль!"
                    name="password"
                    onChange={(e) => setPassword(e?.target?.value)}
                    required
                    value={password}
                    className="userUpdateInput"
                  />
                </div>

                <button
                  className="userUpdateButton"
                  onClick={(e) => changePassword(password)}
                >
                  Сменить пароль
                </button>
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">Изменить</span>
            <div className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>ФИО</label>
                  <input
                    type="text"
                    placeholder="Иванов И.И."
                    name="name"
                    onChange={(e) => setName(e?.target?.value)}
                    required
                    value={name}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="john@gmail.com"
                    name="email"
                    onChange={(e) => setEmail(e.target?.value)}
                    required
                    value={email}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Должность</label>
                  <input
                    type="text"
                    placeholder="менеджер"
                    name="position"
                    onChange={(e) => setPosition(e.target?.value)}
                    required
                    value={position}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Активировать </label>
                  <select
                    className="UserSelect"
                    name="active"
                    id="active"
                    onChange={(e) => setEnabled(e.target?.value)}
                    value={enabled}
                  >
                    <option value="false">Нет</option>
                    <option value="true">Да</option>
                  </select>
                </div>
                <button
                  className="userUpdateButton"
                  onClick={() =>
                    updateUserAdm(name, email, position, enabled, id)
                  }
                >
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default observer(User);