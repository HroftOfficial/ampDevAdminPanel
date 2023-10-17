import React, { useContext, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../hoc/AuthProvider";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import classes from "./newAddZakazMain.module.css";
import InputBlockSkk from "../../../components/UI/InputBlockSkk/InputBlockSkk";
import SelectBlockSkk from "../../../components/UI/SelectBlockSkk/SelectBlockSkk";
import TextAreaSkk from "../../../components/UI/TextAreaSkk/TextAreaSkk";
import ImageDialog from "../../../components/ImageDialog/ImageDialog";

const SUPPORTED_FORMATS = ["image/jpg", "image/png", "image/jpeg", "application/sql"];
const SUPPORTED_FILES_FORMATS = ["image/jpg", "image/png", "image/jpeg", "application/sql"];

const schema = yup
  .object()
  .shape({
    title: yup.string().required("Запоните поле"),
    many: yup.number().moreThan(0, "Значение должно быть больше нуля"),
    details: yup.string().required("Запоните поле"),
    picture: yup
      .mixed()
      .test("required", "отсутвует чертеж", (value) => {
        return value?.length;
      })
      .test("fileSize", "у файла большой размер", (value) => {
        return Boolean(value?.[0]?.size <= 2000000);
      })
      .test("type", "формат файла не поддерживается", function (value) {
        return Boolean(SUPPORTED_FORMATS?.includes(value?.[0]?.type));
      }),
      files: yup
      .mixed()
      .test("required", "отсутвует фаил", (value) => {
        return value?.length;
      })
      .test("fileSize", "у файла большой размер", (value) => {
        return Boolean(value?.[0]?.size <= 2000000);
      })
      .test("type", "формат файла не поддерживается", function (value) {
        return Boolean(SUPPORTED_FILES_FORMATS?.includes(value?.[0]?.type));
      }),
  })
  .required();

const NewAddZakazMainOne = () => {
  const { store } = useContext(AuthContext);
  const [openImage, setOpenImage] = useState(false)
  const [arrayPhoto, setArrayPhoto] = useState([]);
  const [image, setImage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "123",
      details: "info",
      many: 11,
      kl:0,
      max_d:0,
      max_width:0,
      picture:[],
      files:[]
    },
  });
  const onSubmit = (data) => console.log(data, data?.picture?.[0]);

  const selectArr = ["партия","мес/шт","год/шт","шт"];

  const handleCloseImage = () => {
    setOpenImage(false);
  }


  const getImage = async(imageSrc) => {
    handleCloseImage();
    // setImage(imageSrc)
    setArrayPhoto([...arrayPhoto,imageSrc])
    // await changeImage(imageSrc)
  }

  const deleteArrPhoto = (index)=>{
    const newArr = arrayPhoto.splice(index,1);
    console.log(index, arrayPhoto, newArr)
    setArrayPhoto(newArr)
  }

  return (
    <>
        <ImageDialog 
            textDialog={"Выберите фото для Telegram"}
            open={openImage}
            getImage={getImage}
            handleCloseImage={handleCloseImage}
    /> 
      <div className={classes.newZakaz}>
        <h1 className={classes.newZakazTitle}>Добавление заказа one</h1>
        <StoreMessage />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.wrapper}>
            <InputBlockSkk
              // type="text"
              title="Название заказа"
              errors={errors.title?.message}
              regBlock={register("title")}
            />

            <InputBlockSkk
              type="number"
              title="Стоимость"
              errors={errors.many?.message}
              regBlock={register("many")}
              step="0.01"
              min="0"
            />

            <InputBlockSkk
              type="number"
              title="Количество деталей"
              errors={errors.kl?.message}
              regBlock={register("kl")}
              min="0"
            />

            {/* <label>Периодичность</label> */}
            <SelectBlockSkk title="Периодичность" arr={selectArr} />

<InputBlockSkk
              type="number"
              title="Max длина (линейный размер)"
              errors={errors.max_width?.message}
              regBlock={register("max_width")}
              min="0"
            />

<InputBlockSkk
              type="number"
              title="Max диаметр"
              errors={errors.max_d?.message}
              regBlock={register("max_d")}
              min="0"
            />

            <label>Город доставки</label>

            <TextAreaSkk
              title="Описание"
              errors={errors.details?.message}
              regBlock={register("details")}
            />

            <div className={classes.newZakazItem}>
              <label htmlFor="picture">Чертежи</label>
              {/* <input
                id="picture"
                {...register("picture")}
                type="file"
                accept="image/*"
                onChange={()=>console.log('чертежи загружены')}
              /> */}
               <div className={classes.newZakazItem}>
                <button onClick={()=>setOpenImage(true)}>добавить чертеж</button>
                {arrayPhoto?.length>0 && (

                  arrayPhoto?.map((item,index) => (
                    <>
                    <img src={item} key={index} />
                    <button onClick={(e)=>deleteArrPhoto(index)}>удалить</button>
                    </>
                  ))
                )
                }
               </div>
              {errors.picture && <p>{errors.picture.message}</p>}
            </div>
            <div className={classes.newZakazItem}>
              <label htmlFor="files">Файлы</label>
              <input
                id="files"
                {...register("files")}
                type="file"
                accept="image/*"
              />
              {errors.files && <p>{errors.files.message}</p>}
            </div>
          </div>
          <div className={classes.btn}>
            <input type="submit" />
          </div>
        </form>
      </div>
    </>
  );
};

export default NewAddZakazMainOne;
