import React, { useState, useRef } from "react";
import classes from "./imageDialog.module.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import "react-image-crop/dist/ReactCrop.css";


const ImageDialog = ({
  textDialog,
  open,
  handleCloseImage,
  getImage,
  accept,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState("");

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      // setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

   return (
    <Dialog
      open={open}
      onClose={handleCloseImage}
      aria-labelledby="responsive-dialog-title"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="responsive-dialog-title">
        <div className={classes.title}>
          <div className={classes.text_title}>{textDialog}</div>
          <div>
            <input
              // accept="image/*"
              style={{ display: "none" }}
              id="images"
              type="file"
              onChange={onSelectFile}
              required
              accept={accept}
            />
            <label htmlFor="images">
              <Button variant="contained" component="span">
                выбрать фото
              </Button>
            </label>
          </div>
          <div>
            <Button
              autoFocus
              onClick={handleCloseImage}
              variant="contained"
              color="secondary"
            >
              Закрыть
            </Button>
          </div>
        </div>
        <hr />
      </DialogTitle>
      <DialogContent>

      {imgSrc &&
      <img src={imgSrc} alt="select" />
      }
      </DialogContent>
      <DialogActions style={{ margin: "0 auto" }}>
      <Button
          onClick={() => {getImage(imgSrc)}}
            variant="contained"
            color="success"
          >
            Подтвердить
          </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;