import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import "./workGroup.css";
import WorkGroupService from "../../../services/WorkGroupService";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import { AuthContext } from "../../../hoc/AuthProvider";
import MainButton from "../../../components/MainButton/MainButton";

const WorkGroup = () => {
  const { id } = useParams();
  const { store } = useContext(AuthContext);

  const [workGroup, setWorkGroup] = useState({
    name: "",
    raiting: 3,
    legend: "стабильное предприятие",
  });

  const handleChange = (e) => {
    setWorkGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  let location = useNavigate();

  useEffect(() => {
    getItemWorkGroup(id);
  }, []);

  async function getItemWorkGroup(id) {
    try {
      store?.setMessage("");
      const response = await WorkGroupService.fetchItemWorkGroup(id);
      setWorkGroup({
        name: response?.data?.name,
        raiting: response?.data.raiting,
        legend: response?.data.legend,
      });
    } catch (error) {
      store?.setMessage("error?.response?.data?.message");
      console.error(error?.response?.data?.message);
    }
  }

  async function updateWorkGroup(e) {
    try {
      e.preventDefault();
      store?.setMessage("");
      const response = await WorkGroupService.updateWorkGroup(
        id,
        workGroup?.name,
        workGroup?.raiting,
        workGroup?.legend
      );
      location("/workGroup");
    } catch (error) {
      store?.setMessage("error?.response?.data?.message");
      console.error(error?.response?.data?.message);
    }
  }
  return (
    <div className="newUser">
      <h1 className="newUserTitle">Редактировать группу предприятия</h1>
      <StoreMessage />
      <div className="newUserPortalForm">
        <div className="newUserItem">
          <label>Название</label>
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            value={workGroup?.name}
          />
        </div>
        <div className="newUserItem">
          <label>Рейтинг</label>
          <input
            type="text"
            name="raiting"
            required
            onChange={handleChange}
            value={workGroup?.raiting}
          />
        </div>
        <div className="newUserItem">
          <label>Легенда</label>
          <input
            type="text"
            name="legend"
            required
            onChange={handleChange}
            value={workGroup?.legend}
          />
        </div>
        <div className="newUserItem">
          <MainButton
            handleClick={(e) => updateWorkGroup(e)}
            title={"Сохранить"}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(WorkGroup);
