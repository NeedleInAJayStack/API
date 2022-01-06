import React from "react";
import Header from "./header";
import Login from "./login";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: String,
    };
  }

  setToken(token) {
    this.setState({token: token});
    console.log(token);
    // TODO: Redirect to logged in page
  }
  

  render() {
    return (
      <Box component="div" sx={{ display: 'flex', justifyContent: 'center', overflow: 'hidden'}}>
          <Header/>
          <Box sx={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', maxWidth: 400}}>
            <Login onGetToken={ (token) => this.setToken(token) }/>
          </Box>
      </Box>
    );
  }
}

export default App;
