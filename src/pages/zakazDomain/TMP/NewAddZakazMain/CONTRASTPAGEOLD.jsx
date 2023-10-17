import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import classes from "./CONSTRAST.module.css";
import { styled as MIstuled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import citiesData from "../../../utils/citiesFull";

import SpanInput from "../../../components/UI/SpanInput/UI_Input.tsx";

const Listbox = MIstuled("ul")(() => ({
  width: "100%",
  margin: 0,
  padding: 0,
  zIndex: 1,
  top: 50,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "white",
  overflow: "auto",
  maxHeight: 200,
  border: "1px solid rgba(0,0,0,.25)",
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#00AEAE",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#00AEAE",
    color: "white",
  },
}));

const SUPPORTED_FORMATS_PHOTO = ["image/jpg", "image/png", "image/jpeg"];
const SUPPORTED_FORMATS_FILES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const warningTitle = {
  max: "Максимальная длина заголовка 50 символов",
  min: "Минимальная длина заголовка 2 символа",
  required: "Заголовок не может быть пустым",
};

const warningMany = {
  required: "Укажите количество",
};

const warningKl = {
  required: "Укажите количество",
};

const warningDetails = {
  required: "Заполните описание",
};

const schema = yup.object({
  title: yup
    .string()
    .required(warningTitle.required)
    .min(2, warningTitle.min)
    .max(50, warningTitle.max),
  many: yup.string().required(warningMany.required), /////////////////////////
  kl: yup.string().required(warningKl.required),
  details: yup.string().required(warningDetails.required),
});

const AddZakaz = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      many: "",
      kl: "",
      kl_text: "партия",
      max_width: "",
      max_d: "",
      cities: "",
      details: "",
      // picture: [],
      // files: [],
    },
  });

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: citiesData,
    getOptionLabel: (option) => option?.value,
  });

  const handleOpenMenu = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const onSubmit = (data) => {
    console.log("Form data >>> ", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <h2>Создание заказа</h2>

      <label className={errors.title ? classes.input__label__err : classes.input__label}>Введите название заказа</label>
      <SpanInput 
        placeholder={'Название заказа'}
        register={register("title")}
      />


      <label className={errors.many ? classes.input__label__err : classes.input__label}>Укажите стоимость</label>
      <SpanInput 
        type={'number'}
        placeholder={'Стоимость заказа, руб.'}
        register={register("many")}    
        step="0.01"
      />

      <label className={errors.kl ? classes.input__label__err : classes.input__label}>Укажите количество детелей</label>
      <SpanInput 
        type={'number'}
        placeholder={'Количество детелей, шт.'}
        register={register("kl")}    
      />

      <label className={classes.input__label}>Периодичность</label>
      <select className={classes.select} {...register('kl_text')}>
        <option disabled >Периодичность</option>
        <option value="партия">Партия</option>
        <option value="мес/шт">шт./мес.</option>
        <option value="год/шт">шт./год</option>
        <option value="шт.">шт.</option>
      </select>

      <label className={classes.input__label}>Укажите максимальную длину изделия</label>
      <SpanInput 
        type={'number'}
        placeholder={'Максимальная длина (линейный размер), мм.'}
        register={register("max_width")}    
      />

      <label className={classes.input__label}>Укажите максимальный диаметр</label>
      <SpanInput 
        type={'number'}
        placeholder={'Максимальный диаметр, мм.'}
        register={register("max_d")}    
      />


      <label className={classes.input__label}>Город доставки</label>
      <div className={classes.cities__wrapper}>
        <div className={classes.cities__input__wrapper} {...getRootProps()}>
          <input
            className={classes.cities__input}
            {...getInputProps()}
            placeholder="Город доставки"
          />
        </div>
        {groupedOptions.length > 0 && getInputProps().value.length >= 3 ? (
          <Listbox {...getListboxProps()} register={register("cities")}>
            {groupedOptions.map((option, index) => {
              return (
                <li {...getOptionProps({ option, index })} key={index}>
                  {option?.value}
                </li>
              );
            })}
          </Listbox>
        ) : null}
      </div>

      <label
        className={
          errors.details ? classes.input__label__err : classes.input__label
        }
      >
        Описание заказа
      </label>
      <textarea
        className={classes.textarea}
        placeholder="Описание заказа"
        {...register("details")}
      />

      <button className={classes.add__vidi__btn} onClick={handleOpenMenu}>
        Добавить виды обработки
      </button>

      <div className={classes.upload__wrapper}>
        <div className={classes.input__upload__wrapper}>
          <label htmlFor="photo-input">
            Загрузите до 10 фото заказа. Разрешенные форматы: png, jpg, jpeg.
          </label>
          <input
            id="photo-input"
            type="file"
            multiple
            accept={SUPPORTED_FORMATS_PHOTO}
          />
        </div>

        <div className={classes.input__upload__wrapper}>
          <label htmlFor="file-input">
            Загрузите до 10 файлов заказа. Разрешенные форматы: pdf, doc, docx,
            xls, xlsx, png, jpg, jpeg.
          </label>
          <input
            id="file-input"
            type="file"
            multiple
            accept={SUPPORTED_FORMATS_FILES}
          />
        </div>
      </div>

      <button className={classes.btn__submit} type="submite">
        Отправить
      </button>
    </form>
  );
};

export default AddZakaz;
