import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useNavigate } from "react-router-dom";

export default function Header(props) {
  // Props:
  // - onLogout
  
  const [state, setState] = React.useState({
    drawerOpen: false
  });

  let navigate = useNavigate();

  const toggleDrawer = (open) => 
    (event) => {
      if (event.type === 'keydown' && ((event).key === 'Tab' || (event).key === 'Shift')) {
        return;
      }
      setState({ ...state, ["drawerOpen"]: open });
    };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ ml: -2 }}
          onClick={toggleDrawer(true)}
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
        <Drawer
          anchor="left"
          open={state["drawerOpen"]}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem key="Utility Input" disablePadding >
                <ListItemButton onClick={ () => { navigate("/utility-input", { replace: true }); } } >
                  <ListItemText primary="Utility Input" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}