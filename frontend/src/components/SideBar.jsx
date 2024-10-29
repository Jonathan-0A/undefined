import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { items } from '../data/sidebarItems';

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // LogOut function specifically for the Log Out item
  const logOut = async () => {
    try {
      await axios.post("/auth/logout");
      navigate("/auth/login");
    } catch (e) {
      toast.error("Error logging out");
      console.log(e.message);
    }
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        bgcolor: '#1e1e1e', // Dark background
        color: '#ffffff', // White text
        height: '100vh', // Full height drawer
        padding: '20px 10px', // Improved padding
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {items.map((item, i) => (
          <ListItem key={i} disablePadding>
            {item.text === 'Log Out' ? (
              <ListItemButton
                onClick={logOut}
                sx={{
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  mt: 5,
                  '&:hover': {
                    backgroundColor: '#333333', // Lighter hover background
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: '#ddf' }}
                />
              </ListItemButton>
            ) : (
              <ListItemButton
                component={Link}
                to={item.to}
                sx={{
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#333333', // Lighter hover background
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: '#ddf' }}
                />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        edge="start"
        onClick={toggleDrawer(true)}
        aria-label="menu"
        sx={{
          mr: 2,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1e1e1e', // Dark drawer background
            color: '#ffffff', // White text
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', // Shadow for depth effect
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
