import base64 from "base-64";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
  Outlet
} from "react-router-dom";
import Box from '@mui/material/Box';

import Header from "./header";
import Login from "./login";
import Dashboard from "./dashboard";

export default function App() {
  let [state, setState] = React.useState({
    user: null,
    token: null
  });

  let onLogin = (username, password, onSuccess, onFailure) => {
    fetch("/auth/token", {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(username + ":" + password)
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(result => {
          let token = result.token;
          setState({
            user: username,
            token: token
          });
          onSuccess();
        })
      } else {
        onFailure();
      }
    });
  };

  let signout = (callback) => {
    setState({
      user: null,
      token: null
    });
    callback();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <Login onLogin={onLogin} /> } />
        <Route path="/"  element={ <RequireAuth token={state.token} /> } >
          <Route path="/dashboard" element={ <Dashboard token={state.token} /> } />
          <Route path="" element={ <Navigate to="/dashboard" replace /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function RequireAuth(props) {
  let token = props.token;
  let location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, set the formatting and pass to children based on the route
  return (
    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1}}>
        <Outlet />
      </Box>
    </Box>
  );
}
