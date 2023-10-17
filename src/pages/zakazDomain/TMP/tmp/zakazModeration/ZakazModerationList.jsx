import "./zakazModerationList.css";
import { DataGrid, ruRU } from '@mui/x-data-grid';
import { DeleteOutline} from "@material-ui/icons";
import React, { useState, useEffect, useContext } from "react";
import { Layout } from '../../../../../components/layout/Layout';
import ZakazService from "../../../../../services/ZakazService";
// import { Context } from "../../../index";
import { AuthContext } from "../../../../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";

import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';


const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'active zakaz' } };



const ZakazModerationList = () => {
  const { store } = useContext(AuthContext);
  const [zakazes, setZakazes] = useState([]);
  const [pageEditSize, setEditPageSize] = useState(store.usersAmpEditPageSize || 10);
  const [pageSettingsSize, setSettingsPageSize] = useState(store.usersAmpSettingsPageSize || 10);

  const [message, setMessage] = useState('');

  useEffect(() => {
    getZakazesModeration();
  }, []);


  async function getZakazesModeration() {
    try {
      setMessage('');
      store.setLoading(true);
      const response = await ZakazService.fetchZakazes();
      setZakazes(response?.data);
      store.setLoading(false);
    } catch (error) {
      setMessage(error?.response?.data?.message);
    } finally {
      store.setLoading(false);
    }
  }

  async function zakazDelete(id) {
    try {
      const enabled = false;
      const deleted = true;
      const response = await ZakazService.stateZakaz(id, enabled, deleted);
      getZakazesModeration()
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  };

  async function zakazRestore(id) {
    try {
      const enabled = true;
      const deleted = false;
      const response = await ZakazService.stateZakaz(id, enabled, deleted);
      getZakazesModeration()
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  }

  async function stateService(id, service) {
    try {
      const response = await ZakazService.stateService(id, service);
      getZakazesModeration()
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  }

  async function stateEditPageSize(newPageSize) {
    store.setUsersAmpEditPageSize(newPageSize);
    setEditPageSize(newPageSize);
  }
  async function stateSettingsPageSize(newPageSize) {
    store.setUsersAmpSettingsPageSize(newPageSize);
    setSettingsPageSize(newPageSize);
  }

  async function zakazState(e, id, enabled, deleted ) {
    try {
      console.log('checked switch', e.target.checked)
      if(e.target.checked){
        const response = await ZakazService.stateZakaz(id, false, true);
      }else{

        const response = await ZakazService.stateZakaz(id, true, false);
      }
      getZakazesModeration();
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }

  }


  const columns2 = [
    {
      field: 'number',
      headerName: 'номер закза',
      width: 180,
      headerAlign: 'center',
      editable: false,
    },
    {
      field: 'title',
      headerName: 'название',
      width: 200,
      headerAlign: 'center',
      editable: false,
    },
    {
      field: 'enabled',
      headerName: 'активность',
      type: 'boolean',
      headerAlign: 'center',
      with: 150,
      editable: false,
    },
    {
      field: 'deleted',
      headerName: 'Удален',
      headerAlign: 'center',
      type: 'boolean',
      with: 150,
      editable: false,
    },
    {
      field: "action",
      headerName: <div className="actionHeader"><DeleteOutline fontSize="large" className="userListDelete"/>действия</div> ,
      headerClassName:"mainAction",
      width:200,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <>
          <GreenSwitch {...label} 
          checked={params.row.deleted} 
          onChange={(e)=>zakazState(e, params.row._id, params.row.enabled, params.row.deleted)}
          />
          </>
        );
      },
    }
  ];


  return (
    <>
      <div className="zakazList">
        <h1 className="zakazTitle">Модерирование заказов</h1>

            <div style={{ height: 650, width: '90%' }}>

              <DataGrid
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                loading={store.isLoading}
                initialState={{
                  sorting: {
                    sortModel: store.usersAmpSettingsSort,
                  },
                  filter: {
                    filterModel: {
                      items: store.usersAmpSettingsFilter
                    },
                  },
                  pagination: {
                    page: store.usersAmpSettingsPage,
                    pageSize: store.usersAmpSettingsPageSize
                  },
                }}
                getRowId={(row) => row._id}
                getRowClassName={(params) => `super-app-theme--${params.row.deleted}`}
                rows={zakazes}
                columns={columns2}
                onPageSizeChange={(newPageSize) => stateSettingsPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20]}
                pageSize={pageSettingsSize}
                onSortModelChange={(e) => store.setUsersAmpSettingsSort(e)}
                onFilterModelChange={(e) => store.setUsersAmpSettingsFilter(e?.items)}
                onPageChange={(e) => store.setUsersAmpSettingsPage(e)}
              />
            </div>
                         
            <div className="newUserErrorMessage">
                {message}
              </div>
      </div>
    </>
  );
}

export default observer(ZakazModerationList);
