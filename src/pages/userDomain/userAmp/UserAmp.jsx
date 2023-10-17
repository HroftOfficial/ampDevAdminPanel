import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import UserServicePortal from "../../../services/UserServicePortal";
import { AuthContext } from "../../../hoc/AuthProvider";
// import "./userAmp.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import MainButton from "../../../components/MainButton/MainButton";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import classes from "./userAmp.module.css"

const UserAmp = () => {
  const { store } = useContext(AuthContext);
  const { id } = useParams();
  const castArray = (value) => (Array.isArray(value) ? value : [value]);
  const [userPortal, setUserPortal] = useState({
    name: "",
    email: "",
    org: "",
    raiting: "",
    legend: "",
    html: "",
    inn: "",
    ogrn: "",
    info: "",
    description: "",
    state: [],
    stateWork: [],
    toms: [],
    tomsChecked: [],
    workGroup: [],
    accessChecked: [],
  });
  const handleChange = (e) => {
    setUserPortal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [state, setState] = useState([]);
  const [stateWork, setStateWork] = useState([]);
  const [toms, setToms] = useState([]);
  const [workGroup, setWorkGroup] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    getUserAmp(id);
  }, [id]);

  useEffect(() => {
    getHelpers();
  }, []);

  async function getUserAmp(id) {
    try {
      store?.setLoading(true);
      store?.setMessage("");
      const response = await UserServicePortal.getUserAmpToId(id);
      const userData = response?.data;
      setUserPortal({
        name: userData?.name,
        email: userData?.email,
        org: userData?.org,
        raiting: parseInt(userData?.raiting),
        legend: userData?.legend,
        html: userData?.html,
        inn: userData?.inn,
        ogrn: userData?.ogrn,        
        info: userData?.information,
        description: userData?.description,
        toms: [],
        tomsChecked: castArray(userData?.work_category),
        workGroup: [],
        accessChecked: castArray(userData?.user_access_level),
        user_access_level: [],
        work_category: [],
      });
      setStateWork(
        response?.data?.user_access_level?.reduce(
          (obj, cur) => ({ ...obj, [cur]: true }),
          {}
        )
      );
      setState(
        response?.data?.work_category?.reduce(
          (obj, cur) => ({ ...obj, [cur]: true }),
          {}
        )
      );

      store?.setLoading(false);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store?.setLoading(false);
    }
  }

  async function getHelpers() {
    try {
      store?.setMessage("");
      const responseToms = await UserServicePortal.getToms();
      setToms(responseToms?.data);
      const responseWg = await UserServicePortal.getWorkGroup();
      setWorkGroup(responseWg?.data);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  }

  async function updateUser() {
    try {
      store.setLoading(true);
      store?.setMessage("");
      const resultState = Object.keys(state).filter(
        (key) => state[key] === true
      );
      const resultWork = Object.keys(stateWork).filter(
        (key) => stateWork[key] === true
      );
      const arrayAccess = [];
      const arrayWorkCategory = [];
      resultWork.forEach((item) => {
        arrayAccess.push(item);
      });
      resultState.forEach((item) => {
        arrayWorkCategory.push(item);
      });

      const objData = {
        name: userPortal?.name,
        email: userPortal?.email,
        org: userPortal?.org,
        raiting: userPortal?.raiting,
        html__href: userPortal?.html,
        inn: userPortal?.inn,
        ogrn: userPortal?.ogrn,
        information: userPortal?.info,
        description: userPortal?.description,
	legend: userPortal?.legend,
        user_access_level: arrayAccess,
        work_category: arrayWorkCategory,
      };
      await UserServicePortal.updateUserAmp(id, objData);
      navigate("/usersPortals");
      store.setLoading(false);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store.setLoading(false);
    }
  }

  const handleChangeMech = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target?.checked,
    });
  };

  const handleChangeWork = (event) => {
    setStateWork({
      ...stateWork,
      [event.target.name]: event.target?.checked,
    });
  };
  return (
    <>
      <div className={classes.editUser}>
        <h1 className={classes.editUserTitle}>
          Редактирование пользователя портала АМП
        </h1>
        <StoreMessage />
          <div className={classes.editUserForm}>
            <div className={classes.editUserItem}>
              <label>ФИО</label>
              <input
                type="text"
                placeholder="Иванов И.И."
                name="name"
                onChange={handleChange}
                required
                value={userPortal?.name}
              />
            </div>
            <div className={classes.editUserItem}>
              <label>Email</label>
              <input
                type="email"
                placeholder="john@gmail.com"
                name="email"
                onChange={handleChange}
                required
                value={userPortal?.email}
              />
            </div>
            <div className={classes.editUserItem}>
              <label>Название организации</label>
              <input
                type="text"
                placeholder="ООО Хорошее дело"
                name="org"
                onChange={handleChange}
                required
                value={userPortal?.org}
              />
            </div>
            <div className={classes.editUserItem}>
              <label>Рейтинг АМП</label>
              <input
                type="number"
                name="raiting"
                onChange={handleChange}
                required
                min={1}
                max={5}
                value={userPortal?.raiting}
              />
            </div>
            <div className={classes.editUserItem}>
              <label>Легенда рейтинга АМП</label>
              <input
                type="text"
                name="legend"
                onChange={handleChange}
                required
                value={userPortal?.legend}
              />
            </div>
            <div className={classes.editUserItem}>
              <label>Сcылка на сайт организации</label>
              <input
                type="text"
                name="html"
                onChange={handleChange}
                value={userPortal?.html}
                placeholder="http://somesite.com"
              />
            </div>
            <div className={classes.editUserItem}>
              <label>ИНН</label>
              <input
                type="number"
                name="inn"
                onChange={handleChange}
                value={userPortal?.inn}
              />
            </div>
            <div className={classes.editUserItem}>
              <label>ОГРН</label>
              <input
                type="number"
                name="ogrn"
                onChange={handleChange}
                value={userPortal?.ogrn}
              />
            </div>
            <div className={classes.editUserItem}>
              <InputLabel id="info">Инормация о организации</InputLabel>
              <TextareaAutosize
                aria-label="info"
                name="info"
                minRows={3}
                onChange={handleChange}
                value={userPortal?.info}
              />
            </div>
            <div className={classes.editUserItem}>
              <InputLabel id="info">Описание организации</InputLabel>
              <TextareaAutosize
                aria-label="description"
                name="description"
                minRows={3}
                onChange={handleChange}
                value={userPortal?.description}
              />
            </div>
          </div>
        <div className={classes.legendToms}>Группа доступа</div>
        <div className={classes.workGroupArea}>
          {workGroup.map((t) => (
            <>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChangeWork}
                      name={t?.access_level}
                      key={t?.access_level}
                      defaultChecked={userPortal?.accessChecked?.includes(
                        t?.access_level?.toString()
                      )}
                    />
                  }
                  label={t?.name}
                />
              </div>
            </>
          ))}
        </div>
        <div style={{ paddingTop: "20px" }}>
          <hr />
        </div>
        <div className={classes.tomsAreaForm}>
          <div className={classes.legendToms}>Виды мех обработки</div>
          {toms.map((t) => (
            <>
              <div className={classes.legendToms}>{t?._id?.group_name}</div>
              <div className={classes.tomsArea}>
                {t?.items?.map((cb) => (
                  <div className={classes.tomsLabel}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleChangeMech}
                          name={cb?.id_name}
                          key={cb?.id_name}
                          defaultChecked={userPortal?.tomsChecked?.includes(
                            cb?.id_name?.toString()
                          )}
                        />
                      }
                      label={cb?.name}
                    />
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
        <div className={classes.editUserItem}>
          <MainButton handleClick={(e) => updateUser(e)} title={"Сохранить"} />
        </div>
      </div>
    </>
  );
};
export default observer(UserAmp);
