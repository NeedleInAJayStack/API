import base64 from "base-64";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
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

  let signin = (username, password, callback) => {
    fetch('http://localhost:8080/auth/token', {
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
          callback();
        })
      } else {
        alert("User or password not recognized")
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
    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1}}>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/"
              element={
                <Navigate to="/dashboard" replace />
              }
            />
            <Route 
              path="/login"
              element={
                <Login onLogin={signin}/> 
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth token={state.token} >
                  <Dashboard token={state.token} />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </Box>
    </Box>
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

  return props.children;
}

function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.state.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.state.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}
