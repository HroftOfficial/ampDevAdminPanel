import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import classes from "./fileUploadMulti.module.css";
import config from "../../config/config.js";

import {useDropzone} from 'react-dropzone';

const { MAX_DRAFT, UPLOAD_API_URL2 } = config;



const thumb = {
  display: 'flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  // maxWidth: "300px",
  // height: 100,
  width:'100%',
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: '400px',
  // height: '100%',
  objectFit:"cover",
};

const FilesUploadMulti = ({ drafts, selectIndex, setSelectIndex }) => {
  const draftNum = drafts?.length;
  // const [uploadFilesNumber, setUploadFilesNumber] = useState(parseInt(MAX_DRAFT - drafts?.length) )
  const [myFiles, setMyFiles] = useState([])
const  handleAddDraft = (event) => {
event.PreventDefault();

}
  
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState("")
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': []
    },
    maxFiles:(MAX_DRAFT - draftNum),
    onDrop: acceptedFiles => {
      setFiles(...[
        acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })), ...files]
      );
    }
  });

  const removeFile = file => () => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  const removeAll = () => {
    setFiles([])
  }

const thumbs = files.map(file => (
  <div style={thumb} key={file.name}>
    <div style={thumbInner}>
      <img
        src={file.preview}
        style={img}
        // Revoke data uri after image is loaded
        onLoad={() => { URL.revokeObjectURL(file.preview) }}
      />
    </div>
    <li key={file.path}>
      {file.path} - {file.size} bytes{" "}
      <button onClick={removeFile(file)}>Remove File</button>
    </li>
  </div>
));

useEffect(() => {
  // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
  return () => files.forEach(file => URL.revokeObjectURL(file.preview));
}, []);

console.log(files?.length)
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.info}>
          <div> Всего доступно {MAX_DRAFT} файлов для
          загрузки. </div>
          У заказа {drafts?.length} чертежа(ей).
          {MAX_DRAFT - drafts?.length && (
            <>
              <div className={classes.addInfo}>
                <span>
                  Вы можете добавить еще  {MAX_DRAFT - draftNum -files?.length} чертежа(ей)
                </span>
<section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} 
        />
        <p>Добавить 
          disabled={Boolean(MAX_DRAFT - draftNum -files?.length)===0}
          </p>
      </div>
        </section> 
          </div>
        <div className={classes.imageBlock}>
        {files.map(file => (
              <div className={classes.imageWrapper} key={file.name}>
              {/* <div className={classes.thumbInner2}> */}
                <img
                  src={file.preview}
                  style={img}
                  onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
              {/* </div> */}
              <p key={file.path}>
                {file.path} - {file.size} bytes{" "}
              </p>
              <div className={classes.buttonBlock}>

              <Button 
              variant="contained"
              color="error"
              onClick={removeFile(file)}>Удалить файлы</Button>
              </div>
            </div>
        ))};
        </div>
      {files.length > 0 &&              
      <Button 
              variant="contained"
              color="error" 
      onClick={removeAll}>Удалить все</Button>}
    {/* </section> */}
            </>
          )}
        </div>
        {drafts && (
          <div className={classes.imageBlock}>
            {drafts?.map((item, index) => (
              <div
                className={classes.imageWrapper}
                key={index}
                id={item?.filename}
              >
                <img
                  id={index}
                  src={UPLOAD_API_URL2 + "/uploads/tumb/" + item?.filename}
                  alt={index}
                  onClick={(event) => setSelectIndex(event.target.id)}
                  className={
                    selectIndex == index
                      ? (classes.imageZakaz, classes.selectImage)
                      : classes.imageZakaz
                  }
                />
                <div className={classes.buttonBlock}>
                  <Button variant="contained">удалить</Button>
                  <Button variant="contained" color="secondary">
                    сменить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FilesUploadMulti;
