import React from 'react';
import classes from "./spanTextArea.module.css";

type Props = {
  title: string;
  placeholder: string;
  errors: string;
  register: object;
};

const SpanTextArea: React.FC<Props>  = ({ title, errors, placeholder, register, ...props }) => {
  return (
    <>
      <label className={errors ? classes.input__label__err : classes.input__label}>{title}</label>
      <textarea
        className={classes.textarea}
        {...register}
        {...props}
        placeholder={placeholder}
      />
    </>
  )
}

export default SpanTextArea;
