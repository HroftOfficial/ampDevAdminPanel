import React from 'react';
import classes from "./spanSelectBlock.module.css"

type Props = {
  title: string;
  arr: Array<string>;
};

const SpanSelectBlock: React.FC<Props>  = ({ title, arr, ...props }) => {
  return (
    <>
      <label className={classes.input__label}>{title}</label>
      <select {...props} className={classes.select}>
        {arr?.map((item,index)=>(
          <option value={item} key={index}>{item}</option>
        ))}
      </select>
    </>
  )
}

export default SpanSelectBlock
