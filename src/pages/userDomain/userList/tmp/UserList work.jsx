import "./userList.css";
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { userRows, usersRows } from "../../../dummyData";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from '../../../components/layout/Layout';
import { getPageCount, getPagesArray } from '../../../utils/pages';
import AuthService from "../../../services/AuthService";
// import {Context} from "./index";
import {observer} from "mobx-react-lite";


const UserList = ()=> {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  let pagesArray = getPagesArray(totalPages);

  useEffect(() => {
    getUsers();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[page]);

async function getUsers() {
  try {
      const response = await AuthService.fetchUsers(page,limit);
      console.log(response.data)
      setUsers(response.data);
      const totalCount = response.headers['x-total-news'];
      setTotalPages(getPageCount(totalCount, limit));
  } catch (e) {
      console.log(e);
  }
}

const changePage = async(page) =>{
  setPage(page);
}



  const [data, setData] = useState(usersRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  
  // const columns = [
  //   { field: "_id", headerName: "ID", width: 90 },
  //   {field: "name", headerName: "User", width: 200 },
  //   // {
  //   //   field: "user",
  //   //   headerName: "User",
  //   //   width: 200,
  //   //   renderCell: (params) => {
  //   //     return (
  //   //       <div className="userListUser">
  //   //         <img className="userListImg" src={params.row.avatar} alt="" />
  //   //         {params.row.username}
  //   //       </div>
  //   //     );
  //   //   },
  //   // },
  //   { field: "email", headerName: "Email", width: 200 },
  //   // {
  //   //   field: "status",
  //   //   headerName: "Status",
  //   //   width: 120,
  //   // },
  //   {
  //     field: "position",
  //     headerName: "Position",
  //     width: 160,
  //   },
  //   // {
  //   //   field: "action",
  //   //   headerName: "Action",
  //   //   width: 150,
  //   //   renderCell: (params) => {
  //   //     return (
  //   //       <>
  //   //         <Link to={"/user/" + params.row.id}>
  //   //           <button className="userListEdit">Edit</button>
  //   //         </Link>
  //   //         <DeleteOutline
  //   //           className="userListDelete"
  //   //           onClick={() => handleDelete(params.row.id)}
  //   //         />
  //   //       </>
  //   //     );
  //   //   },
  //   // },
  // ];

  const columns = [
    // { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'ФИО',
      width: 150,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      editable: false,
    },
    {
      field: 'position',
      headerName: 'Должность',
      width: 250,
      editable: false,
    },
    {
      field:'enabled',
      headerName:'активность',
      type:'boolean',
      with:150,
      editable: false,
    },
    {
      field: "action",
      headerName: "Действия",
      width: 170,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">редактировать</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },

  ];

  // const rows = [
  //   { id: 1, email: 'g@mail.ru', name: 'Jon', age: 35, position:'менеджер', enabled: true  },
  //   { id: 2, email: 'Lannister', name: 'Cersei', age: 42, position:'менеджер' },
  //   { id: 3, email: 'Lannister', name: 'Jaime', age: 45, position:'менеджер' },
  //   { id: 4, email: 'Stark', name: 'Arya', age: 16, position:'менеджер' },
  //   { id: 5, email: 'Targaryen', name: 'Daenerys', age: null, position:'менеджер' },
  //   { id: 6, email: 'Melisandre', name: 'tets', age: 150, position:'менеджер' },
  //   { id: 7, email: 'Clifford', name: 'Ferrara', age: 44, position:'менеджер' },
  //   { id: 8, email: 'Frances', name: 'Rossini', age: 36, position:'менеджер' },
  //   { id: 9, email: 'Roxie', name: 'Harvey', age: 65, position:'менеджер' },
  // ];
  
  return (
    <Layout>
      {/* <div style={{ height: 400, width: '100%' }}>
      <DataGrid
      getRowId={(row) => row._id}
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div> */}
    <div className="userList">
      <div className="userListCreateWrapper">      
        <Link to="/newUser">
          <button className="userAddButton">Создать</button>
        </Link>
        </div>
        <div style={{ height: 400, width: '100%' }}>
      <DataGrid
      getRowId={(row) => row._id}
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
      {/* <DataGrid
      getRowId={(row) => row._id}
        rows={users}
        disableSelectionOnClick
        columns={columns}
        pageSize={10}
        checkboxSelection
        /> */}
    </div>
        </Layout>
  );
}

export default observer(UserList);
