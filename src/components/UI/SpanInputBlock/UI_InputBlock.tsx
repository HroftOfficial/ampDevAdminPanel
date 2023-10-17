import React from "react";
import classes from "./UI_InputBlock.module.css";

type Errors = {
  message: string,
  ref: object,
  type: string,
}

type Props = {
  title: string;
  placeholder: string;
  errors: Errors;
  register: object;
};

const InputBlock: React.FC<Props> = ({ title, placeholder, errors, register, ...props }) => {
  return (
    <>
      {errors ? 
        <label className={ classes.input__label__err}>{errors.message}</label> :
        <label className={classes.input__label}>{title}</label>
      }
      <input {...props} {...register} className={classes.input} placeholder={placeholder} />
    </>
  );
};

export default InputBlock;
