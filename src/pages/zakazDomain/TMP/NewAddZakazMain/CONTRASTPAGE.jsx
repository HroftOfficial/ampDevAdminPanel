import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import classes from "./CONSTRAST.module.css";

import SpanInputBlock from "../../../components/UI/SpanInputBlock/UI_InputBlock.tsx";
import SpanSelectBlock from "../../../components/UI/SpanSelectBlock/SpanSelectBlock.tsx";
import SpanTextArea from "../../../components/UI/SpanTextArea/SpanTextArea.tsx";
import SpanInputCities from "../../../components/UI/SpanInputCitiesBlock/SpanInputCities.tsx";
import SpanUploadBlock from "../../../components/UI/SpanUploadBlock/SpamUploadBlock.tsx";
import SimpleUploadFiles from "../../../components/UI/SimpleUploadFiles/SimpleUploadFiles.tsx";

import VidiModal from '../../../components/UI/ModalVidi/VidiModal';

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

const selectArr = ["партия", "мес/шт", "год/шт", "шт"];

const warningMany = {
  required: "Укажите стоимость",
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
  const [selectedText, setSelectedText] = useState([]);
  const [selected, setSelected] = useState([]);

  const [openImage, setOpenImage] = useState(false);
  const [arrayPhoto, setArrayPhoto] = useState([]);

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
      cities: "Ростов-на-Дону",
      details: "",
      // picture: [],
      // files: [],
    },
  });

  const handleOpenMenu = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const onSubmit = (data) => {
    console.log("Form data >>> ", data);
    console.log("Form vivi meh >>> ", selected);
    
  };

  const handleCloseImage = () =>{
    setOpenImage(false)
  }

  const getImage = (imageSrc) => {
    // setOpenImage(false)
    handleCloseImage();
    // setImage(imageSrc)
    setArrayPhoto([...arrayPhoto,imageSrc])
    // await changeImage(imageSrc)
    // console.log(...arrayPhoto)
  }

  const handleDelete = (e) => {
    const id = e.target?.parentElement.children[0].id;
    const name = e.target?.parentElement.children[0].innerText;

    const tempSelected = selected.slice()
    const index1 = tempSelected.indexOf(id)
    tempSelected.splice(index1, 1)
    setSelected(tempSelected)

    const tempSelectedText = selectedText.slice()
    const index2 = tempSelectedText.indexOf(name)
    tempSelectedText.splice(index2, 1)
    setSelectedText(tempSelectedText)
  }

  return (
  <>
 
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <h2>Создание заказа</h2>

      <SpanInputBlock
        title={"Введите название заказа"}
        placeholder={"Название заказа"}
        register={register("title")}
        errors={errors?.title}
      />

      <SpanInputBlock
        title={"Укажите стоимость"}
        placeholder={"Стоимость заказа, руб."}
        register={register("many")}
        errors={errors?.many}
        step="0.01"
        min="0"
        type={"number"}
      />

      <SpanInputBlock
        title={"Укажите количество детелей"}
        placeholder={"Количество детелей, шт."}
        register={register("kl")}
        errors={errors?.kl}
        min="0"
        type={"number"}
      />

      <SpanSelectBlock
        title="Периодичность"
        arr={selectArr}
        register={register("kl_text")}
      />

      <SpanInputBlock
        title={"Укажите максимальную длину изделия"}
        placeholder={"Максимальная длина (линейный размер), мм."}
        register={register("max_width")}
        min="0"
        type={"number"}
      />

      <SpanInputBlock
        title={"Укажите максимальный диаметр"}
        placeholder={"Максимальный диаметр, мм."}
        register={register("max_d")}
        min="0"
        type={"number"}
      />

      <SpanInputCities 
      title={"Город доставки"}
      register={register("cities")}
      />

      <SpanTextArea
        title={"Описание заказа"}
        errors={errors?.details}
        placeholder={"Описание заказа"}
        register={register("details")}
      />

      {selectedText?.length > 0 && <div className={classes.toms}>
        <h2 className={classes.tom__title}>Выбранные виды мехобработки:</h2>
        {selectedText.map((item, index) => (
          <div className={classes.tom}>
            <div id={index}>{item}</div> 
            <div className={classes.close} onClick={handleDelete}>&times;</div>
          </div>
        ))}
      </div>}

      <button className={classes.add__vidi__btn} onClick={handleOpenMenu}>
        Добавить виды обработки
      </button>

      {showModal && 
        <VidiModal 
          selected={selected}
          setSelected={setSelected}
          selectedText={selectedText}
          setSelectedText={setSelectedText}
          setShowModal={setShowModal}
        />
      }

      <div className={classes.upload__wrapper}>
        <SimpleUploadFiles 
                  labelTitle={"Загрузите до 10 фото заказа. Разрешенные форматы: png, jpg, jpeg."}
                  title={"Выбeрите фото"}
                  openImage={openImage}
                  getImage={getImage}
                  handleCloseImage={handleCloseImage}
                  accept={SUPPORTED_FORMATS_PHOTO}
                  onClick={()=>setOpenImage(true)}
        />
        {/* <SpanUploadBlock 
          labelTitle={"Загрузите до 10 фото заказа. Разрешенные форматы: png, jpg, jpeg."}
          title={"Выбeрите фото"}
          openImage={openImage}
          getImage={getImage}
          handleCloseImage={handleCloseImage}
          accept={SUPPORTED_FORMATS_PHOTO}
          onClick={()=>setOpenImage(true)}
        /> */}
        {arrayPhoto?.length > 0 && (
          arrayPhoto?.map((item,index) => (
            <>
            <img src={item} key={index} />
            {/* <button onClick={(e)=>deleteArrPhoto(index)}>удалить</button> */}
            <button onClick={(e)=>console.log('delete')}>Удалить</button>
            </>
            ))
        )}

        {/* <div className={classes.input__upload__wrapper}>
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
        </div> */}
      </div>

      <button className={classes.btn__submit} type="submite">
        Отправить
      </button>
    </form>
    </>
  );
};

export default AddZakaz;
