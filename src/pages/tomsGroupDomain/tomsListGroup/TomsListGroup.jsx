import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {observer} from "mobx-react-lite";
import "./tomsList.css";
import TomsGroupService from "../../../services/TomsGroupService";
import { AuthContext } from "../../../hoc/AuthProvider";
import EditButton from "../../../components/CustomButton/EditButton";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import CircleButton from "../../../components/CustomButton/CircleButton";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import ChangeImageButton from "../../../components/CustomButton/ChangeImageButton";
import ChangeButton from "../../../components/CustomButton/ChangeButton";
import { PinkSwitch, BlueSwitch, GreenSwitch } from "../../../settings/some";
import { DataGrid,ruRU  } from '@mui/x-data-grid';

const TomsListGroup = ()=> {
  const {store} = useContext(AuthContext);

  const [tomsGroup, setTomsGroup] = useState([]);

  useEffect(() => {
    getTomsGroup();
  },[]);

  async function getTomsGroup() {
    try {
      store?.setMessage('')
      store?.setLoading(true);
        const response = await TomsGroupService.fetchWTomsGroup();
        setTomsGroup(response?.data);
        store?.setLoading(false)
    } catch (error) {
      store?.setMessage(error?.response?.data?.message)
    }  
    finally{
      store?.setLoading(false)
    }

  }

   const columns = [
    {
      field: 'name_rus',
      headerName: 'Название rus',
      width: 300,
      editable: false,
    },
    {
      field: 'name_eng',
      headerName: 'Название eng',
      width: 200,
      editable: false,
    },
    {
      field: 'enabled',
      headerName: 'Активность',
      type:'boolean',
      width: 100,
      editable: false,
    },
    {
      field: "action",
      headerName: "Действия",
      width: 150,
      headerAlign:'center',
      align: 'center',
      cellClassName:'actionStyle',
      renderCell: (params) => {
        return (
          <>
          <Link to={"/tomsGroup/" + params?.row?._id} style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
          <EditButton/>
          </Link>
           {/* <DeleteOutline
           fontSize="large"
            className="userListDelete"
            onClick={() => userDelete(params.row._id)}
          /> 
          <RestoreFromTrashOutlined
          fontSize="large"
           className="userListRestore"
           onClick={() => userRestore(params.row._id)}
           /> */}
        </>
        );
      },
    },

  ];


  return (
        <div className="userList">
        <h1 className="newUserTitle">Виды мех обработки(группы)</h1>
        <StoreMessage />
        <CircleButton link={"/tomsGroup/newTomsGroup"} />
        <CustomDataGrid
          rows={tomsGroup}
          columns={columns}
          getRowClassName={(params) => `super-app-theme--${params?.row?.deleted}`}
        />
      </div>
  );
}

export default observer(TomsListGroup);
