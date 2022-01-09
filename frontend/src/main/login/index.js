import React from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useAuth } from "../auth";

export default function Login(props) {
  const [state, setState] = React.useState({
    username: "",
    password: "",
  });

  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  function handleSetUsername(event) {
    setState({ ...state, username: event.target.value });
  }

  function handleSetPassword(event) {
    setState({ ...state, password: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    auth.signin(state.username, state.password, () => {
      navigate(from, { replace: true });
    });
  }

  return (
    <Box component="div" sx={{ display: 'flex', justifyContent: 'center', overflow: 'hidden'}}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              JayHerron.org
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: -2 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Box component="form" sx={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', maxWidth: 400}}>
        <Container>
          <Stack spacing={2}>
            <TextField id="username" label="Username" variant="outlined" onChange={handleSetUsername} />
            <TextField id="password" type="password" label="Password" variant="outlined" onChange={handleSetPassword} />
            <Button variant="contained" onClick={handleSubmit} >Log In</Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}