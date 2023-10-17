import React from 'react';
import SimpleImageDialog from "../SimpleImageDialog/SimpleImageDialog.tsx"
import classes from "./simpleUploadFiles.module.css";

type Props = {
  title: string;
  openImage: boolean;
  getImage: Function;
  handleCloseImage: boolean;
  accept: Array<String>;
  labelTitle: string;
};

{/* <div className={classes.input__upload__wrapper}>
<label htmlFor="photo-input">
  Загрузите до 10 фото заказа. Разрешенные форматы: png, jpg, jpeg.
</label>
<input
  id="photo-input"
  type="file"
  multiple
  accept={SUPPORTED_FORMATS_PHOTO}
/>
</div> */}

const SimpleUploadBlock: React.FC<Props>  = ({ labelTitle, title, openImage, getImage, handleCloseImage, accept, ...props }) => {
  return (
    <div className={classes.input__upload__wrapper} {...props}>
      <label>
        {labelTitle}
      </label>

      <SimpleImageDialog 
        textDialog={title}
        open={openImage}
        getImage={getImage}
        handleCloseImage={handleCloseImage}
        accept={accept}
      /> 
    </div>
  )
}

export default SimpleUploadBlock;
