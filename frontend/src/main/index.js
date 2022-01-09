import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";

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
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" render={ () => <div>Logged in</div> } ></Route> */}

          <Route path="/" element={ <Login onGetToken={ (token) => this.setToken(token) }/> }></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
