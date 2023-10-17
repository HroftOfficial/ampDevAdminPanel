import React from 'react';
import classes from "./selectBlockSkk.module.css"

const SelectBlockSkk = ({title,arr,...props}) => {
    const castArray = (value) => (Array.isArray(value) ? value : [value]);
    const valArr = castArray(arr);
  return (
    <div className={classes.item}>
                <label>{title}</label>
          <select {...props}>
            {valArr?.map((item,index)=>(
                <option value={item} key={index}>{item}</option>
            ))}
          </select>
          <p></p>
    </div>
  )
}

export default SelectBlockSkk
