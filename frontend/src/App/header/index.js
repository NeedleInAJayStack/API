import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useNavigate } from "react-router-dom";

export default function Header(props) {
  // Props:
  // - onLogout
  
  let navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ ml: -2 }}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" component="div" textAlign="center" sx={{ flexGrow: 1 }}>
          JayHerron.org
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: -2 }}
          onClick={ () => {
            props.onLogout();
            navigate("/login", { replace: true });
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}