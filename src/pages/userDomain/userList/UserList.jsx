import "./userList.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import AuthService from "../../../services/AuthService";
import UserAdmService from "../../../services/UserAdmService.js";
import { AuthContext } from "../../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";
import renderCellExpand from "../../../components/GridCellExpand/GridCellExpand";
import {PinkSwitch} from "../../../settings/some";
import CustomDataGrid from "../../../components/CustomDataGrid/CustomDataGrid";
import CircleButton from "../../../components/CustomButton/CircleButton";
import DeleteDialog from "../../../components/Dialog/DeleteDialog";
import CreateDialog from "../../../components/Dialog/CreateDialog";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import EditButton from "../../../components/CustomButton/EditButton";
import DeleteButton from "../../../components/CustomButton/DeleteButton";

const UserList = () => {
  const { store } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [openCreate, setOpenCreate] = useState(false)
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState('')

  useEffect(() => {
    getUsers();
  }, []);

  const label = { inputProps: { "aria-label": "active zakaz" } };

  const handleChangeEnabled = async (event, id) => {
    try {
      store?.setMessage("");
      const checkedValue = event?.target?.checked;
      await UserAdmService.stateUserPortal(id, checkedValue);
      getUsers();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  };

  async function getUsers() {
    try {
      store?.setMessage("");
      store?.setLoading(true);
      const response = await AuthService.fetchUsers();
      setUsers(response.data);
      store?.setLoading(false);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store?.setLoading(false);
    }
  }

  const prepareDelete = async (id, name) => {
    setIdDelete({ id, name });
    setOpen(true);
  };

  const handleDelete = () => {
    zakazDelete(idDelete?.id);
    setOpen(false);
  };

  async function zakazDelete(id) {
    try {
      store?.setMessage('');
      await UserAdmService.deleteUser(id);
      getUsers();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  }

  /**
   * create
   */
   async function handleCreate() {
    try {
      store?.setMessage("");
      store?.setLoading(true);
      await UserAdmService.createAdmin(name, email, password, position)
      store?.setLoading(false);
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    } finally {
      store?.setLoading(false);
    }
   }

  const columns = useMemo(()=>[
    {
      field: "name",
      headerName: "ФИО",
      width: 200,
      editable: false,
      // headerAlign:"center",
      renderCell: renderCellExpand,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: false,
      // headerAlign:"center",
      renderCell: renderCellExpand,
    },
    {
      field: "position",
      headerName: "Должность",
      width: 200,
      editable: false,
      // headerAlign:"center",
      renderCell: renderCellExpand,
    },
    {
      field: "enabled",
      headerName: "Активность",
      type: "boolean",
      with: 150,
      editable: false,
      disableColumnMenu: true,
      headerAlign:"center",
      renderCell: (params) => {
        return (
          <div className="styleButton">
            <PinkSwitch
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
      headerName: "Редактировать",
      width: 130,
      disableColumnMenu: true,
      sortable: false,
      headerAlign:"center",
      renderCell: (params) => {
        return (<EditButton link ={`/user/${params.row._id}`}/> );
      },
    },
    {
      field: "action2",
      headerName: "Удалить",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      headerAlign:"center",
      renderCell: (params) => {
        return (
          <DeleteButton handleClick={() => prepareDelete(params?.row?._id, params?.row?.name)}/>
        );
      },
    },
  ]);

  return (
    <>
      <DeleteDialog
        textDialog={`Внимание! Вы собираетесь удалить пользователя ${idDelete?.name}.`}
        handle={handleDelete}
        open={open}
        setOpen={setOpen}
      />
        <CreateDialog
        textDialog={"Форма создания пользователя"}
        handle={handleCreate}
        open={openCreate}
        setOpen={setOpenCreate}
        name={name} 
        setName={setName} 
        email={email} 
        setEmail={setEmail}
        password={password}
        setPassword ={setPassword}
        position={position}
        setPosition={setPosition}
      />
      <div className="userList">
        <h1 className="newUserTitle">Пользователи (АДМ)</h1>
        <StoreMessage />
        <CircleButton link={'/newUser'}/>
        <CustomDataGrid rows={users} columns={columns}/>
      </div>
    </>
  );
};

export default observer(UserList);
