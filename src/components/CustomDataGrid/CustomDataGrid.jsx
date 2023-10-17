import React,{useContext} from 'react';
import { DataGrid, ruRU } from "@mui/x-data-grid";
import { AuthContext } from "../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";

const CustomDataGrid = ({rows,columns, ...params}) => {
    const {store} = useContext(AuthContext);
  return (
    <div style={{ height: 650, width: "90%" }}>
    <DataGrid
      localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
      loading={store?.isLoading}
      getRowId={(row) => row._id}
      rows={rows}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      disableSelectionOnClick
      {...params}
    />
  </div>
  )
}

export default observer(CustomDataGrid);