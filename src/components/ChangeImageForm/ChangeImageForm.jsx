import React,{useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Cropper from "react-easy-crop";

const ChangeImageForm = ({title,onSelectFile,changeImage,handleCloseImage, newImage,openImage,onCropComplete}) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);  
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
           <Dialog
        fullScreen={fullScreen}
        open={openImage}
        onClose={handleCloseImage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <div className="imgLogoButton">
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="images"
              type="file"
              onChange={onSelectFile}
              required
            />
            <label htmlFor="images">
              <Button
                variant="contained"
                component="span"
                className="imageButton"
              >
                поменять логотип
              </Button>
            </label>
          </div>
        </DialogContent>
        <Box
          component="div"
          sx={{
            width: "auto",
            height: "500px",
            border: "1px dashed grey",
            position: "relative",
          }}
        >
          {newImage ? (
            <Cropper
              image={newImage}
              crop={crop}
              zoom={zoom}
              // aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          ) : null}
        </Box>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color="secondary"
            onClick={handleCloseImage}
          >
            Отменить
          </Button>
          <Button variant="contained" color="primary" onClick={changeImage}>
            сменить логотип
          </Button>
        </DialogActions>
      </Dialog> 
    </>
  )
}

export default ChangeImageForm
