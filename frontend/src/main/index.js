import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header";
import Login from "./login";
import Box from '@mui/material/Box';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ""
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
            <BrowserRouter>
              <Routes>
                {/* <Route path="/" render={ () => <div>Logged in</div> } ></Route> */}

                <Route path="/" element={ <Login onGetToken={ (token) => this.setToken(token) }/> }></Route>
              </Routes>
            </BrowserRouter>
          </Box>
      </Box>
    );
  }
}

export default App;
