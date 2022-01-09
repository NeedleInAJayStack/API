import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from "react-router-dom";
import { 
  AuthProvider,
  useAuth
} from "./auth";
import Login from "./login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login"
            element={
              <Login /> 
            }
          />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <LoggedIn />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
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

function LoggedIn() {
  let auth = useAuth();

  return (
    <h3>Logged in as {auth.state.user}</h3>
  );
}

export default App;
