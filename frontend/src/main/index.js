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

import { 
  AuthProvider,
  useAuth
} from "./auth";
import Header from "./header";
import Login from "./login";
import Dashboard from "./dashboard";

function App() {
  return (
    <AuthProvider>
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
                  <Login /> 
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
            </Routes>
          </BrowserRouter>
        </Box>
      </Box>
    </AuthProvider>
  );
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.state.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
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

export default App;
