import React from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function Login(props) {
  const [state, setState] = React.useState({
    username: "",
    password: "",
  });

  let navigate = useNavigate();
  let location = useLocation();
  let onLogin = props.onLogin;

  let from = location.state?.from?.pathname || "/";

  function handleSetUsername(event) {
    setState({ ...state, username: event.target.value });
  }

  function handleSetPassword(event) {
    setState({ ...state, password: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(state.username, state.password, () => {
      navigate(from, { replace: true });
    });
  }

  return (
    <Box component="form" sx={{flexGrow: 1,  display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: 400 }}>
      <Stack spacing={2}>
        <TextField id="username" label="Username" variant="outlined" onChange={handleSetUsername} />
        <TextField id="password" type="password" label="Password" variant="outlined" onChange={handleSetPassword} />
        <Button variant="contained" onClick={handleSubmit} >Log In</Button>
      </Stack>
    </Box>
  );
}