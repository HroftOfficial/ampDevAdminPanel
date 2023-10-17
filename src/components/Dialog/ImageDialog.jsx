import React, { useState, useRef} from 'react'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import {canvasPreview, useDebounceEffect, imgPreview} from "../../utils/cropImage";  
import 'react-image-crop/dist/ReactCrop.css';
import styled from 'styled-components';

function centerAspectCrop(
  mediaWidth,
  mediaHeight,
  aspect,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const ImageDialog = ({textDialog,open, handleCloseImage,newImage,setNewImage,buttonClick, ...props}) => {
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState(16 / 9)
  const [newImageCroped, setNewImageCroped] = useState()

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }
  
  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
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
          rotate,
        )
      }
    },
    100,
    [completedCrop, scale, rotate],
  )
    
  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined)
    } else if (imgRef.current) {
      const { width, height } = imgRef.current
      setAspect(16 / 9)
      setCrop(centerAspectCrop(width, height, 16 / 9))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseImage}
      aria-labelledby="responsive-dialog-title"
      fullWidth={true}
      maxWidth='md'
    >
      <DialogTitle id="responsive-dialog-title">
        {textDialog}
        <Button
          autoFocus
          onClick={handleCloseImage}
          variant="contained"
          color="secondary"
          style={{marginLeft: '500px'}}
        >
          Отменить
        </Button>
      </DialogTitle>

      <DialogContent style={{display: 'flex', flexDirection: 'column', height: '400px'}}>
        <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="images"
            type="file"
            onChange={onSelectFile}
            // onChange={(e) => {
            //   selectImage(e.target.files[0]);
            // }}
            required
          />
          <label htmlFor="images">
            <Button
              variant="contained"
              component="span"
              className="imageButton"
            >
              выбрать фото
            </Button>
          </label>
        </div>
        {/* // start panel */}

        <BoxSettings>
        <Label>
          <label htmlFor="scale-input">Маштаб: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </Label>
        <Label>
          <label htmlFor="rotate-input">Наклон: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
          />
        </Label>
        </BoxSettings>

        <Contaner>
          <Button onClick={handleToggleAspectClick} className="imageButton" variant="contained"
              component="span">{aspect ? 'Разрешить' : 'Запретить'} менять соотношение сторон 
          </Button>
        </Contaner>
        {/* //end panel */}
      </DialogContent>

      {imgSrc && <App >
          <Box
            component="div"
            sx={{
              width: "auto",
              height: "500px",
              border: "1px dashed grey",
              position: "relative",
            }}
          >
          {Boolean(imgSrc) && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              // style={{display: 'flex', flexDirection: 'column' }}
            >
              <CropMe
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>)
          }



          <div style={{zIndex: '1', display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
          {Boolean(completedCrop) && (
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
                display:'none',
                zIndex: '1',
              }}
            />
          )}
        {/* {Boolean(newImage) && (

          <img src={newImage} alt='alt' 
          style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height,
            }}
            />
            )} */}

          {newImageCroped && <CropedIMG alt="Crop preview" src={newImageCroped} />}
        </div>

      </Box>
      {imgSrc && <ButtonCut onClick={() => setNewImageCroped(previewCanvasRef?.current?.toDataURL('image/png', 0.8))}>
            Обрезать
          </ButtonCut>}
    </App>}
      <DialogActions style={{margin: '0 auto'} }>
        {Boolean(buttonClick) ? 
          <>
            <Button
              autoFocus
              onClick={handleCloseImage}
              variant="contained"
              color="secondary"
            >
              Отменить
            </Button>
            <Button
              autoFocus
              onClick={buttonClick}
              variant="contained"
              color="primary"
            >
              Сменить
            </Button>
          </>
          
        : <>{newImageCroped &&
        <Button
          autoFocus
          onClick={() => {
            handleCloseImage();
            setNewImage(newImageCroped);
          }}
          variant="contained"
          color="success"
          // style={{marginTop: '0px'}}
          
        >
          Подтвердить
        </Button>
        }
        </>
      }
        {/* <Button onClick={changeImage} >
          сменить логотип
        </Button> */}
      </DialogActions>
    </Dialog>
 )
}

export default ImageDialog

const Label = styled.div`
  margin-bottom: 10px;
  font-size: 16px;

  input {
    font-size: 16px;
    padding: 10px 20px;
    outline: none;
  }
`;

const App = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Contaner = styled.div`
  display: flex;
  width: 400px;
  margin: 0 auto;
`;

const CropMe = styled.img`
  max-height: 500px !important;
`;

const CropedIMG = styled.img`
  max-width: 400px;
  margin: 70px 0;
  border: 1px solid black;
  z-index: 1;
`;

const ButtonCut = styled.button`
  display: flex;
  background: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
  text-transform: uppercase;
  background-color: #1976d2;
  color: white;
  border-radius: 3px;
  margin: 20px 0 4px;
  z-index: 10;
`;

const BoxSettings = styled.div`
  display: flex;
  padding: 10px 20px 5px;
  justify-content: space-around;
`;