import React from 'react';
import classes from "./spanUploadBlock.module.css";
import ImageDialog from "../../ImageDialog/ImageDialog"



const SpanUploadBlock  = ({labelTitle, title,openImage,getImage,handleCloseImage,accept,...props}) => {
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
