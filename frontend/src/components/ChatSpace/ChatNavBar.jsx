import React from "react";
import { AppBar, Toolbar, Avatar, Typography, Button, Box } from "@mui/material";
import { Logout } from "@mui/icons-material";

function ChatNavbar({ user }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1f1f1f", boxShadow: "none" }}>
      <Toolbar>
        <Avatar alt={user?.username} src={user?.avatarImage} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography component="div" sx={{ color: "#ffffff", fontSize: "18px" }}>
            {user?.name || "No chat selected"} 
          </Typography>
          <Typography component="div" sx={{ color: "#99a", fontSize: "14px" }}>
            {
              user ? "online" : ""
            }
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ChatNavbar;
