import React,{ useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {observer} from "mobx-react-lite";
import "./tomsList.css";
import TomsService from "../../../services/TomsService";
import { AuthContext } from "../../../hoc/AuthProvider";
import EditButton from "../../../components/CustomButton/EditButton";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import CircleButton from "../../../components/CustomButton/CircleButton";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";

import ChangeImageButton from "../../../components/CustomButton/ChangeImageButton";
import ChangeButton from "../../../components/CustomButton/ChangeButton";
import { PinkSwitch, BlueSwitch, GreenSwitch } from "../../../settings/some";
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, ruRU } from '@mui/x-data-grid';
// import { DeleteOutline, RestoreFromTrashOutlined} from "@material-ui/icons";
// import {Context} from "../../../index";

const TomsList = ()=> {
  const {store} = useContext(AuthContext);
  
  const [toms, setToms] = useState([]);
  const [pageSize, setPageSize] = useState(store.tomsPageSize || 10);
  const [message, setMessage] = useState('');


  useEffect(() => {
    getToms();
  },[]);

  async function getToms() {
    try {
      store.setLoading(true);
        const response = await TomsService.fetchToms();
        setToms(response?.data);
        store.setLoading(false)
    } catch (error) {
        setMessage(error?.response?.data?.message)
    }
    finally{
      store.setLoading(false)
    }
  }

   const columns = [
    {
      field: 'name',
      headerName: ' Название',
      width: 300,
      editable: false,
    },
    {
      field: 'out',
      headerName: 'Группа оборудования',
      width: 250,
      editable: false,
      valueGetter:(params) => params?.row?.out[0]?.name_rus,
      type: 'string',
    },
    {
      field:'enabled',
      headerName:'Активность',
      type:'boolean',
      with:150,
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
            <Link to={"/toms/" + params?.row?._id} style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
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
      <h1 className="newUserTitle">Виды обработки</h1>
      <StoreMessage />
      <CircleButton link={"/toms/newToms"} />
      <CustomDataGrid
        rows={toms}
        columns={columns}
        getRowClassName={(params) => `super-app-theme--${params.row.deleted}`}
      />
    </div>
  );
}

export default observer(TomsList);
