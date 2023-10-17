import React from "react";
import classes from "./UI_Input.module.css";

// type Props = {
// 	placeholder: string,
// 	type: string,
// 	register: any,
//   step: string,
// }

// const Input: React.FC<Props> = ({ placeholder, type, register, step }) => {

// 	return (
// 		<input
//       className={classes.input}
// 			placeholder={placeholder}
// 			type={type}
//       step={step}
// 			{...register}
// 		/>
// 	)
// }

type Props = {
  placeholder: string;
};

const Input: React.FC<Props> = ({ placeholder, ...props }) => {
  return (
    <input {...props} className={classes.input} placeholder={placeholder} />
  );
};

export default Input;
