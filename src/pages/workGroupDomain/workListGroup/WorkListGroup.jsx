import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {observer} from "mobx-react-lite";
import "./workList.css";
import WorkGroupService from "../../../services/WorkGroupService";
import { AuthContext } from "../../../hoc/AuthProvider";

import EditButton from "../../../components/CustomButton/EditButton";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import { GreenSwitch } from "../../../settings/some";
import CircleButton from "../../../components/CustomButton/CircleButton";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import renderCellExpand from "../../../components/GridCellExpand/GridCellExpand";

const WorkListGroup = ()=> {
  const {store} = useContext(AuthContext);

  const label = { inputProps: { "aria-label": "users active" } };
  const [work, setWork] = useState([]);

  useEffect(() => {
    getWorkGroup();
  },[]);

    /**
   * main
   */
  const handleChangeEnabled = async (event, id) => {
    try {
      store?.setMessage("");
      const checkedValue = event?.target?.checked;
      await WorkGroupService.stateUserPortal(id, checkedValue);
      getWorkGroup();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  };



async function getWorkGroup() {
  try {
    store?.setLoading(true);
      const response = await WorkGroupService.fetchWorkGroup();
      setWork(response?.data);
      store?.setLoading(false)
  } catch (error) {
    store?.setMessage(error?.response?.data?.message)
  } finally{
    store?.setLoading(false)
  }
}

   const columns = [
    {
      field: 'name',
      headerName: 'Название',
      width:200,
      description:'Название предприятия',
      renderCell: renderCellExpand,
    },
    {
      field: 'access_level',
      headerName: 'Гр. безоп.',
      width: 100,
      editable: false,
      headerAlign: "center",

    },
    {
      field: 'raiting',
      headerName: 'Рейтинг',
      width: 100,
      editable: false,
      headerAlign: "center",

    },
    {
      field: 'legend',
      headerName: 'Легенда',
      width: 350,
      editable: false,
      renderCell: renderCellExpand,
      headerAlign: "center",

    },
    {
      field: "enabled",
      headerName: "Активность",
      type: "boolean",
      with: 150,
      editable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="styleButton">
            <GreenSwitch
              {...label}
              checked={params?.row?.enabled}
              onChange={(event) => handleChangeEnabled(event, params.row._id)}
            />
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Действия",
      width: 150,
      headerAlign:'center',
      align: 'center',
      cellClassName:'actionStyle',
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
          <Link to={"/workGroup/" + params.row._id} style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
            <EditButton />
          </Link>
        </>
        );
      },
    },

  ];

  return (
    <>
      <div className="userList">
        <h1 className="newUserTitle">Пользователи портала</h1>
        <StoreMessage />
        <CircleButton link={"/workGroup/newWorkGroup"} />
        <CustomDataGrid
          rows={work}
          columns={columns}
        />
      </div>   
    </>
  );
}

export default observer(WorkListGroup);
