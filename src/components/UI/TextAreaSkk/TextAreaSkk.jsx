import React from 'react';
import classes from "./textAreaSkk.module.css";

const TextAreaSkk = ({title,errors,regBlock,...props}) => {
  return (
    <div className={classes.item}>
    <label>{title}</label>
    <textarea
    rows="10"
    {...regBlock}
    {...props}
      placeholder={title}
    />
     <p>{errors}</p>
      
    </div>
  )
}

export default TextAreaSkk;
