import React, { useContext, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hoc/AuthProvider";
import {observer} from "mobx-react-lite";
import './login.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const LoginForm = () => {
  // const [user, setUser] = useState({
  //   email:'sagdinov.a@yandex.ru',
  //   password:'Paralaxx99'
  // })
  const [user, setUser] = useState({})
  const {store} = useContext(AuthContext);
  let navigate = useNavigate();


  const handleChange =(e)=>{
    setUser(prev=>({...prev,[e.target.name]:e.target.value}))
  }

  const theme = createTheme();

  return(   
    <div className="containerLogin">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1,  bgcolor: 'pink' }} >
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Вход в АМП 
            </Typography>

            <Box component="form"  noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="primary"
                onClick={() => store.login(user.email, user.password, navigate)}
              >
                Войти
              </Button>

            </Box>
          </Box>
          
          <Box
            sx={{
            paddingTop: 18,
            display: 'flex',
            flexDirection: 'column',
            color:'coral',
            }}
          >
            <Typography component="h1" variant="h6">
              {store.message}
            </Typography>
          </Box>

        </Container>
      </ThemeProvider>
    </div>
    )

}
export default observer(LoginForm);