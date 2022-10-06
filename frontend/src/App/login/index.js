import React from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function Login(props) {
  const [state, setState] = React.useState({
    username: "",
    password: "",
    invalidLoginOpen: false,
  });

  let navigate = useNavigate();
  let location = useLocation();
  let onLogin = props.onLogin;

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(
      state.username,
      state.password,
      () => {
        navigate(from, { replace: true });
      },
      () => {
        setState({ ...state, invalidLoginOpen: true });
      },
    );
  }

  function handleInvalidLoginClose() {
    setState({ ...state, invalidLoginOpen: false })
  }

  return (
    <Box
      component="div" 
      display="flex"
      flexDirection="column"
      height="100%"
      overflow="hidden"
    >
      <Box 
        display="flex"
        flexDirection="column"
        alignItems="center"
        flexGrow={8}
      >
        <Stack
          spacing={2}
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          flexGrow={1}
          justifyContent="center"
          width="100%"
          maxWidth={400}
        >
          <TextField
            label="Username"
            variant="filled"
            onChange={ (event) => {
              setState({ ...state, username: event.target.value });
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            onChange={ (event) => {
              setState({ ...state, password: event.target.value });
            }}
          />
          <Button
            type="submit"
            variant="contained"
          >
            Log In
          </Button>
        </Stack>
        <Dialog
          open={state.invalidLoginOpen}
          onClose={handleInvalidLoginClose}
        >
          <DialogTitle>User or password not recognized</DialogTitle>
        </Dialog>
      </Box>
    </Box>
  );
}