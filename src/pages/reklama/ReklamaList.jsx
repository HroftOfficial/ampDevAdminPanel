import React, { useState, useEffect, useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { AuthContext } from "../../hoc/AuthProvider";
import renderCellExpand from '../../components/GridCellExpand/GridCellExpand';
import EditButton from "../../components/CustomButton/EditButton";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid";
import { GreenSwitch } from "../../settings/some";
import CircleButton from "../../components/CustomButton/CircleButton";
import StoreMessage from "../../components/StoreMessage/StoreMessage";
import ReklamaService from '../../services/ReklamaService';
import config from "../../settings/config";
import DeleteButton from "../../components/CustomButton/DeleteButton";

const ZakazList = () => {
  const { store } = useContext(AuthContext);
  const [ad, setAd] = useState([]);

  useEffect(() => {
    getReklama();
  }, []);

  const getReklama = async () => {
    try{
      (async() => {
        const response = await ReklamaService.getReklamas();
        setAd(response?.data)
      })()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (event, id) => {
    try {


      const da = prompt('Точно?', 'Да') 
      if (da == 'Да' || da == 'да')  {
        store?.setMessage("");
        await ReklamaService.deleteReklama(id);
        getReklama();
      } else {
      }     
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  };

  const handleChangeEnabled = async (event, id) => {
    try {
      store?.setMessage("");
      const checkedValue = event?.target?.checked;
      await ReklamaService.stateReklama(id, {enabled: checkedValue});
      getReklama();
    } catch (error) {
      store?.setMessage(error?.response?.data?.message);
    }
  };

  const columns = useMemo(()=>[
  
    {
      field: "enabled",
      headerName: "Активность",
      type: "boolean",
      with: 120,
      editable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="styleButton">
            <GreenSwitch
              checked={params?.row?.enabled}
              onChange={(event) => handleChangeEnabled(event, params?.row?._id)}
            />
          </div>
        );
      },
    },
    {
      field: 'title',
      headerName: 'Название',
      width: 600,
      editable: false,
      renderCell: renderCellExpand,
    },
    {
      field: "preview_url",
      headerName: "Изображение",
      width: 170,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            {params?.value[0] ? (
              <img
                src={params.value[0]?.path?.replace(
                  /public/i,
                  config?.UPLOAD_API_URL
                )}
                alt="logo"
                style={{ width: "60px" }}
              />
            ) : null}

          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Редактировать",
      width: 170,
      disableColumnMenu: true,
      sortable: false,
      headerAlign:"center",

      renderCell: (params) => {
        return (
          <EditButton link={"/reklama/edit/" + params?.row?._id} />
        );
      },
    },{
      field: "deleted",
      headerName: "Удалить",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      headerAlign:"center",
      renderCell: (params) => {
        return (
          <DeleteButton handleClick={(event) => handleDelete(event, params?.row?._id)}/>
        );
      },
    }
  ]);

  return (
    <>
      <div className="userList">
        <h1 className="newUserTitle">Реклама</h1>
        <StoreMessage />
        <CircleButton link={"/reklama/new"} />
        <CustomDataGrid
          rows={ad}
          columns={columns}
          getRowClassName={(params) => `super-zakaz-theme--${params?.row?.deleted}`}
        />
      </div>

    </>
  );
}

export default observer(ZakazList);