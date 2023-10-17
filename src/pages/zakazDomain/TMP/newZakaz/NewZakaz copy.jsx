import React,{useState} from 'react';

import { makeStyles } from '@material-ui/core';
import { Stepper, Step, StepLabel, Typography, Button } from '@material-ui/core';

// import { TextField, Button, Box } from "@material-ui/core";
// import { Formik } from "formik";
// import * as yup from 'yup';
import { Layout } from "../../../components/layout/Layout";
// import MyTextArea from "../../../components/MyTextArea/MyTextArea";
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import NumberFormat from "react-number-format";
// import Autocomplete from '@mui/material/Autocomplete';
// import { cities } from '../../../utils/only_cities2';
import './newZakaz.css';
import NewZakazStepOne from "./NewZakazStepOne";
import NewZakazStepTwo from './NewZakazStepTwo';


// const validationSchema = yup.object({
//     title: yup.string().required('Поле обязательно для заполнения'),
//     details: yup.string().required('Поле обязательно для заполнения'),
//     many: yup.number('Здесь должно быть число').required('Если неизветсно - ставьте ноль'),
//     kl: yup.number('Здесь должно быть число').required('Если неизветсно - ставьте ноль'),
//     maxD: yup.number('Здесь должно быть число').required('Если неизветсно - ставьте ноль'),
//     maxWidth: yup.number('Здесь должно быть число').required('Если неизветсно - ставьте ноль'),
//     // cities__id: yup.object().shape({
//     //     id: yup.number().test('is not select city', 'не выбран город', (value)=> value == null || value === 0),
//     //     value: yup.string()
//     // })
// })

const useStyles = makeStyles({
    root:{
        // width: "80%",
        // border: "1px solid #999"
        margin:"6rem auto",
        "& .MuiStepIcon-root.MuiStepIcon-active":{
            color:"red"
        },
        "& .MuiStepIcon-root.MuiStepIcon-completed":{
            color:"red"
        }
    },
    title:{
        textAlign:"center",
        color: "coral"
    },
    btn:{
        marginTop: '30px', 
        width: '200px',
        padding:"10px"
    },
    container_btn:{
        display:"flex",
        justifyContent:"space-between",
        alignContent:"center"
    },
    conatainer:{
        display:'flex'
    }
})

const NewZakaz = () => {

    function getSteps() {
        return ['текстовые данны',"группа доступа - владелец закза","виды мех обработки","чертежи и файлы"]
    }
    
    const steps2 = getSteps()
    
    function getStepsContent(stepIndex){
        switch(stepIndex){
            case 0: return <NewZakazStepOne next={handleNextStep} data={data} />;
            case 1: return <NewZakazStepTwo next={handleNextStep} prev={handlePrevStep} data={data} />
            case 2: return "виды мех обработки";
            case 3: return "чертежи и файлы";
            default: return "неизвестный шаг"
    
        }
    }


    const [data, setData] = useState({
        title: '',
        details: '',
        many: 0,
        kl: 0,
        selectKlText: 'партия',
        maxD: 0,
        maxWidth: 0,
        cities__id:{ id:0, value: "неизвестно" }
    });

    const [currentStep, setCurrentStep] = useState(0);

    const makeRequest = (formData) => {
      console.log("Form Submitted", formData);
    };
  
    const handleNextStep = (newData, final = false) => {
      setData((prev) => ({ ...prev, ...newData }));
  
      if (final) {
        makeRequest(newData);
        return;
      }
  
      setCurrentStep((prev) => prev + 1);
    };
  
    const handlePrevStep = (newData) => {
      setData((prev) => ({ ...prev, ...newData }));
      setCurrentStep((prev) => prev - 1);
    };

    const steps = [
        <NewZakazStepOne next={handleNextStep} data={data} currentStep={currentStep} steps2={steps2} handlePrevStep={handlePrevStep}/>,
        <NewZakazStepTwo next={handleNextStep} prev={handlePrevStep} data={data} />
      ];

      const classes = useStyles();

    return (
        <Layout>
            <div className="newZakaz">
                <div className={classes.root}>

                <h1 className={classes.title}>Новый заказ</h1>
                <Stepper alternativeLabel  activeStep={currentStep}>
                    {steps2.map(label=>(
                        <Step key={label}>
                            <StepLabel>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
                    </div>
                {steps[currentStep]}
                {/* {getStepsContent(currentStep)}  */}
                {/* <div className={classes.container}> */}

                <div className={classes.container_btn}>
                {currentStep === steps2.length ? "все шаги выполнены" : (
                    <>          
                    {/* {getStepsContent(currentStep)}       */}
                        {currentStep > 0 && 
                        <Button onClick={handlePrevStep} variant="contained" color="primary" className={classes.btn}>
                            назад
                        </Button>
                    }

                    {/* <Button onClick={handleNextStep} variant="contained" color="primary" className={classes.btn} type='submit'>
                        {currentStep === steps2.length ? "сохранить" : "далее"}
                    </Button> */}
                    <Button variant="contained" color="primary" className={classes.btn} type='submit'>
                        {currentStep === steps2.length ? "сохранить" : "далее"}
                    </Button>
                </>
                )}
                {/* </div> */}
                </div>
                {/* <NewZakazStepOne data={data} /> */}

                {/* <Formik
                    initialValues={{
                        title: '',
                        details: '',
                        many: 0,
                        kl: 0,
                        selectKlText: 'партия',
                        maxD: 0,
                        maxWidth: 0,
                        cities__id:{ id:0, value: "неизвестно" }
                    }}
                    onSubmit={values => {
                        alert(JSON.stringify(values, null, 2))
                    }}
                    validationSchema={validationSchema}
                >
                    {(formik) =>
                        <form onSubmit={formik.handleSubmit}>
                            {/* <div className="newZakazForm">
                                <div className="newZakazItem">
                                    <label>Наименование заказа</label>
                                    <TextField id="title"
                                        variant="outlined"
                                        name="title"
                                        // label="Название заказа"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                        helperText={formik.touched.title && formik.errors.title}
                                    />
                                </div>
                                <div className="newZakazItem">
                                    <MyTextArea
                                        id="details"
                                        variant="outlined"
                                        name="details"
                                        label="Описание заказа"
                                        value={formik.values.details}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className="newZakazItem">
                                    <label>Стоимость</label>
                                    <NumberFormat
                                        thousandSeparator={" "}
                                        // prefix={'₽ '} 
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        decimalSeparator={"."}
                                        // className='muiInput'
                                        customInput={TextField}
                                        variant="outlined"
                                        name='many'
                                        id='many'
                                        // label="Стоимость"
                                        value={formik.values.many}
                                        onChange={formik.handleChange}
                                        error={formik.touched.many && Boolean(formik.errors.many)}
                                        helperText={formik.touched.many && formik.errors.many}
                                    />
                                </div>
                                <div className="newZakazItemSmall">
                                    <label>Количество</label>
                                    <TextField id="kl"
                                        variant="outlined"
                                        name="kl"
                                        type="number"
                                        value={formik.values.kl}
                                        onChange={formik.handleChange}
                                        error={formik.touched.kl && Boolean(formik.errors.kl)}
                                        helperText={formik.touched.kl && formik.errors.kl}
                                    />
                                </div>
                                <div className="newZakazItemSmall">
                                    <label>Периодичность</label>
                                    <Select
                                        name="selectKlText"
                                        value={formik.values.selectKlText}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value={'партия'} style={{ display: 'block' }}>партия</MenuItem>
                                        <MenuItem value={'месяц-шт'} style={{ display: 'block' }}>месяц-шт</MenuItem>
                                        <MenuItem value={'год-шт'} style={{ display: 'block' }}>год-шт</MenuItem>
                                    </Select>
                                    {formik.errors.selectKlText &&
                                        formik.touched.selectKlText &&
                                        <div className="input-feedback">
                                            {formik.errors.selectKlText}
                                        </div>}
                                </div>
                                <div className="newZakazItemSmall">
                                    <label>Max D</label>
                                    <TextField id="maxD"
                                        variant="outlined"
                                        name="maxD"
                                        type="number"
                                        value={formik.values.maxD}
                                        onChange={formik.handleChange}
                                        error={formik.touched.kl && Boolean(formik.errors.maxD)}
                                        helperText={formik.touched.maxD && formik.errors.maxD}
                                    />
                                </div>
                                <div className="newZakazItemSmall">
                                    <label>Max L</label>
                                    <TextField id="maxWidth"
                                        variant="outlined"
                                        name="maxWidth"
                                        type="number"
                                        value={formik.values.maxWidth}
                                        onChange={formik.handleChange}
                                        error={formik.touched.maxWidth && Boolean(formik.errors.maxWidth)}
                                        helperText={formik.touched.maxWidth && formik.errors.maxWidth}
                                    />
                                </div>
                                <div className="newZakazItem">
                                    <label>Населенный пункт</label>
                                    <Autocomplete
                                        value={formik.values.cities}
                                        onChange={(e, value) => formik.setFieldValue("cities__id", value !== null ? value : {id:0, value: "неизвестно" })}
                                        onOpen={formik.handleBlur}
                                        // error={formik.touched.cities__id && Boolean(formik.errors.cities__id)}
                                        // helperText={formik.touched.cities__id && formik.errors.cities__id}
                                        autoHighlight
                                        getOptionLabel={(option) => option.value}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                {option.value}
                                            </Box>
                                        )}
                                        id="cities_id"
                                        name="cities_id"
                                        options={cities}
                                        renderInput={(params) => (
                                            <TextField
                                                variant="outlined"
                                                {...params}
                                                label="Выберите город"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    // autoComplete: 'new-cities', 
                                                }}
                                            />
                                            )}
                                            />
                                            {formik.touched.cities__id && Boolean(formik.errors.cities__id) ? (
                                                <div className="error">{formik.errors.cities__id}</div>
                                            ) : null}
                                </div>
                            </div>
                            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 30, width: 200 }}>Сохранить</Button> 
                        </form>}
                </Formik> */}
            </div>
        </Layout>
    )
}

export default NewZakaz;