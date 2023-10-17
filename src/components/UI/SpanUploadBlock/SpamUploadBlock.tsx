import React from 'react';
import classes from "./spanUploadBlock.module.css";
import ImageDialog from "../../ImageDialog/ImageDialog"

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

const SpanUploadBlock: React.FC<Props>  = ({ labelTitle, title, openImage, getImage, handleCloseImage, accept, ...props }) => {
  return (
    <div className={classes.input__upload__wrapper} {...props}>
      <label>
        {labelTitle}
      </label>

      <ImageDialog 
        textDialog={title}
        open={openImage}
        getImage={getImage}
        handleCloseImage={handleCloseImage}
        accept={accept}
      /> 
    </div>
  )
}

export default SpanUploadBlock;
