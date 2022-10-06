import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import Header from "./header";
import Login from "./login";
import UtilityInput from "./utility-input";
import { getAuthToken } from "./API";

// https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=B2DFDB&secondary.color=616161
const theme = createTheme({
  palette: {
    primary: {
      main: '#b2dfdb',
    },
    secondary: {
      main: '#616161',
    },
  },
});

export default function App() {
  let [state, setState] = React.useState({
    user: null,
    token: null
  });

  let onLogin = (username, password, onSuccess, onFailure) => {
    try {
      getAuthToken(username, password).then((result) => {
        setState({
          user: username,
          token: result.token
        });
        onSuccess();
      });
    } catch {
      onFailure();
    }
  };

  function clearTokens() {
    setState({
      authToken: null,
      refreshToken: null
    });
  }

  let onLogout = () => {
    clearTokens();
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={ <Login onLogin={onLogin} /> } />
          <Route path="/"  element={ <RequireAuth token={state.token} onLogout={onLogout} /> } >
            <Route path="/utility-input" element={ <UtilityInput token={state.token} /> } />
            <Route path="*" element={ <Navigate to="/" replace /> } />
            <Route path="" element={ <Navigate to="/utility-input" replace /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function RequireAuth(props) {
  let authToken = props.token;
  let onLogout = props.onLogout;
  let location = useLocation();

  if (!authToken) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, set the formatting and pass to children based on the route
  return (
    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
      <Header onLogout={onLogout} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1}}>
        <Outlet />
      </Box>
    </Box>
  );
}
