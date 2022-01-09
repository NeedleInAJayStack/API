import React from "react";
import base64 from "base-64";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleSetUsername = this.handleSetUsername.bind(this);
    this.handleSetPassword = this.handleSetPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSetUsername(event) {
    this.setState({username: event.target.value});
  }
  handleSetPassword(event) {
    this.setState({password: event.target.value});
  }
  handleSubmit(event) {
    fetch('http://localhost:8080/auth/token', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(result =>
          this.props.onGetToken(result.token)
        )
      }
    });

    event.preventDefault();
  }

  render() {
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
        <Box sx={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', maxWidth: 400}}>
          <Container>
            <Stack spacing={2}>
              <InputLabel htmlFor="username">Username:</InputLabel>
              <Input id="username" type="text" value={this.state.username} onChange={this.handleSetUsername} />
              <InputLabel htmlFor="password">Password:</InputLabel>
              <Input id="password" type="password" value={this.state.password} onChange={this.handleSetPassword} />
              <Button variant="contained" onClick={this.handleSubmit} >Log In</Button>
            </Stack>
          </Container>
        </Box>
      </Box>
    );
  }
}

export default Login;