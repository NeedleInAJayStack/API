import React from "react";
import base64 from "base-64";

import Box from '@mui/material/Box';
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
      <Container>
        <Stack spacing={2}>
          <InputLabel htmlFor="username">Username:</InputLabel>
          <Input id="username" type="text" value={this.state.username} onChange={this.handleSetUsername} />
          <InputLabel htmlFor="password">Password:</InputLabel>
          <Input id="password" type="password" value={this.state.password} onChange={this.handleSetPassword} />
          <Button variant="contained" onClick={this.handleSubmit} >Log In</Button>
        </Stack>
      </Container>
    );
  }
}

export default Login;