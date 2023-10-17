import React, { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../hoc/AuthProvider";
import StoreMessage from "../../../components/StoreMessage/StoreMessage";
import classes from "./newAddZakazMain.module.css";
import InputBlockSkk from "../../../components/UI/InputBlockSkk/InputBlockSkk";
import SelectBlockSkk from "../../../components/UI/SelectBlockSkk/SelectBlockSkk";
import TextAreaSkk from "../../../components/UI/TextAreaSkk/TextAreaSkk";

const SUPPORTED_FORMATS = ["image/jpg", "image/png", "image/jpeg", "application/sql"];

const schema = yup
  .object()
  .shape({
    title: yup.string().required("Запоните поле"),
    many: yup.number().moreThan(0, "Значение должно быть больше нуля"),
    details: yup.string().required("Запоните поле"),
    picture: yup
      .mixed()
      .test("required", "отсутвует чертеж", (value) => {
        return value && value.length;
      })
      .test("fileSize", "у файла большой размер", (value) => {
        // return value && value[0] && value[0].size <= 2000000;
        const boolArr =[]
        console.log(value?.length)
            for (const key in value) {
              if (Object.hasOwnProperty.call(value, key)) {
                const element = value[key];
                console.log(element?.size)
                console.log(element?.type)
               boolArr.push(Boolean(element?.size <= 2000000))
              }
            }
            return Boolean(!boolArr?.includes(false))
      })
      .test("type", "поддерживается только jpeg", function (value) {
            const boolArr =[]
            for (const key in value) {
              if (Object.hasOwnProperty.call(value, key)) {
                const element = value[key];
                console.log(element?.type)
               boolArr.push(SUPPORTED_FORMATS?.includes(element?.type))
              }
            }
            return Boolean(!boolArr?.includes(false))
      }),
      files: yup
      .mixed()
      .test("required", "отсутвует фаил", (value) => {
        return value && value.length;
      })
      .test("fileSize", "у файла большой размер", (value, context) => {
        return value && value[0] && value[0].size <= 2000000;
      })
      .test("type", "формат файла не поддерживается", function (value) {
        return (
          // (value && value[0] && value[0].type === "image/jpeg" || "image/png")
          (value?.[0]?.type === "image/jpeg" || 
          value?.[0]?.type === "image/png"
          )
        );
      }),
  })
  .required();

const NewAddZakazMain = () => {
  const { store } = useContext(AuthContext);
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

  return (
    <>
      <div className={classes.newZakaz}>
        <h1 className={classes.newZakazTitle}>Добавление заказа</h1>
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
              <input
                id="picture"
                {...register("picture")}
                type="file"
                accept="image/*"
                multiple
                onChange={()=>console.log('чертежи загружены')}
              />
              {errors.picture && <p>{errors.picture.message}</p>}
            </div>
            <div className={classes.newZakazItem}>
              <label htmlFor="files">Файлы</label>
              <input
                id="files"
                {...register("files")}
                type="file"
                accept="image/*"
                multiple
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

export default NewAddZakazMain;
