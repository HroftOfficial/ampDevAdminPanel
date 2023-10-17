import React from 'react';
import classes from "./spanInputCities.module.css";
import { styled as MIstuled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import citiesData from "../../../utils/citiesFull";

type Props = {
  title: string;
  placeholder: string;
  register: object;
};

const Listbox = MIstuled("ul")(() => ({
  width: "100%",
  margin: 0,
  padding: 0,
  zIndex: 1,
  top: 50,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "white",
  overflow: "auto",
  maxHeight: 200,
  border: "1px solid rgba(0,0,0,.25)",
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#00AEAE",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#00AEAE",
    color: "white",
  },
}));

const SpanInputCities: React.FC<Props>  = ({ title, placeholder, register, ...props }) => {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: citiesData,
    getOptionLabel: (option) => option?.value,
  });
  return (
    <>
      <label className={classes.input__label}>{title}</label>
        <div className={classes.cities__wrapper}>

          <div className={classes.cities__input__wrapper} {...getRootProps()}>
            <input
            {...props}
              className={classes.cities__input}
              {...getInputProps()}
              placeholder="Город доставки"
            />
          </div>

          {groupedOptions.length > 0 && getInputProps()?.value?.length >= 3 ? (
            <Listbox {...getListboxProps()} {...register}>
              {groupedOptions.map((option, index) => {
                return (
                  <li {...getOptionProps({ option, index })} key={index}>
                    {option?.value}
                  </li>
                );
              })}
            </Listbox>) : null}
            
        </div>
    </>
  )
}

export default SpanInputCities;
