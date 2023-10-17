import React from 'react';
import classes from "./inputBlockSkk.module.css"

const InputBlockSkk = ({title,errors,regBlock,...props}) => {
  return (
       
      <div className={classes.item}>
      <label>{title}</label>
                <input
                {...regBlock}
                {...props}
                  placeholder={title}
                />
                 <p>{errors}</p>
      </div>
  )
}

export default InputBlockSkk
