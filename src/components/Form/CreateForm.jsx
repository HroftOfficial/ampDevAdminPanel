import React,{useState} from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

const CreateForm = (name, setName, email, setEmail, password, setPassword, ...props) => {
  return (
    <>
    <FormControl style={{padding:'10px 20px'}}>
 <TextField
          required
          id="name"
          label="ФИО"
          value={name}
          onChange={(e)=>setName(e?.target?.value)}
        />
        <div style={{padding:'10px 20px'}}></div>
         <TextField
          required
          id="email"
          label="email"
          value={email}
          onChange={(e)=>setEmail(e?.target?.value)}
        />
        <div style={{padding:'10px 20px'}}></div>
        <TextField
          id="password"
          label="пароль"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e?.target?.value)}
        />
        </FormControl>
</>
  )
}

export default CreateForm