import React, { useState, useContext } from "react";
import { useNavigate} from "react-router-dom";
import { observer } from "mobx-react-lite";
import "./newWorkGroup.css";
import WorkGroupService from "../../../services/WorkGroupService";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import { AuthContext } from "../../../hoc/AuthProvider";
import MainButton from "../../../components/MainButton/MainButton";

const NewWorkGroup = () => {
  const { store } = useContext(AuthContext);
  const [workGroup, setWorkGroup] = useState({
    name: "",
    raiting: 3,
    legend: "стабильное предприятие",
  });

  const handleChange = (e) => {
    setWorkGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  let navigate = useNavigate();

  async function createWorkGroup(e) {
    try {
      e.preventDefault();
      store?.setMessage("");

      await WorkGroupService.createWorkGroup(
        workGroup?.name,
        workGroup?.raiting,
        workGroup?.legend
      );
      navigate("/workGroup");
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
      console.error(error.response.data.message);
    }
  }

  return (
    <div className="newUser">
      <h1 className="newUserTitle">Создать группу предприятия</h1>
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
            handleClick={(e) => createWorkGroup(e)}
            title={"Создать"}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(NewWorkGroup);
