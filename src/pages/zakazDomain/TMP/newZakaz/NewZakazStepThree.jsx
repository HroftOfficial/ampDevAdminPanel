import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import StepButtons from '../../../components/StepButtons/StepButtons';

const stepTwoValidationSchema = yup.object({
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().label("Password")
  });

const NewZakazStepThree = (props) => {
    const handleSubmit = (values) => {
        props.next(values, true);
      };
  return (
    <Formik
    validationSchema={stepTwoValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit}
  >
    {({ values }) => (
      <Form>
        <p>Email</p>
        <Field name="email" />
        <ErrorMessage name="email" />

        <p>Password</p>
        <Field name="password" />
        <ErrorMessage name="password" />
        <StepButtons currentStep={props.currentStep} steps2={props.steps2} handlePrevStep={props.handlePrevStep} />

        {/* <button type="button" onClick={() => props.prev(values)}>
          Back
        </button>
        <button type="submit">Submit</button> */}
      </Form>
    )}
  </Formik>
  )
}

export default NewZakazStepThree
