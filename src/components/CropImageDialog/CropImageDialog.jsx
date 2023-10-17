import React, { useState, useRef } from "react";
import classes from "./cropImageDialog.module.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ReactCrop from "react-image-crop";
import {
  canvasPreview,
  useDebounceEffect,
  centerAspectCrop,
} from "../../utils/cropImage";
import "react-image-crop/dist/ReactCrop.css";
import CropImageDialogPanel from "./CropImageDialogPanel/CropImageDialogPanel";

const CropImageDialog = ({
  textDialog,
  open,
  handleCloseImage,
  // setNewImage,
  getCropImage,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(false);
  const [newImageCropped, setNewImageCropped] = useState();

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(16 / 9);
      setCrop(centerAspectCrop(width, height, 16 / 9));
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
              accept="image/*"
              style={{ display: "none" }}
              id="images"
              type="file"
              onChange={onSelectFile}
              required
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
        <div>
          <CropImageDialogPanel
            imgSrc={imgSrc}
            setScale={setScale}
            setRotate={setRotate}
            handleToggleAspectClick={handleToggleAspectClick}
            aspect={aspect}
            onSelectFile={onSelectFile}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
        <div>
          {!!completedCrop && (
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
                display: "none",
              }}
            />
          )}

          {newImageCropped && (
            <img
              alt="Crop preview"
              src={newImageCropped}
              className={classes.crop_img}
            />
          )}
        </div>
        {/* MAIN END  */}
      </DialogContent>
      <DialogActions style={{ margin: "0 auto" }}>
        {imgSrc && (
          <Button
            onClick={() =>
              setNewImageCropped(
                previewCanvasRef?.current?.toDataURL("image/png", 0.8)
              )
            }
            variant="contained"
            color="warning"
          >
            Обрезать
          </Button>
        )}

        {newImageCropped && (          
          <Button
          onClick={() => {getCropImage(newImageCropped)}}
            // onClick={() => {
            //   setNewImage(newImageCropped);
            //   handleCloseImage();
            // }}
            variant="contained"
            color="success"
          >
            Подтвердить
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CropImageDialog;