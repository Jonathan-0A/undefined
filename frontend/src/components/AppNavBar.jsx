import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SideBar from "./SideBar";
import LoginIcon from "@mui/icons-material/Login"; // Login icon
import { Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function AppNavbar({ user }) {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#333", height: "55px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left: Sidebar and Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SideBar />
          <Typography
            variant="h6"
            sx={{
              ml: 2, // Add margin between sidebar and title
              fontWeight: "bold",
              color: "#ddf",
            }}
          >
            <RouterLink to="/" style={{ textDecoration: "none", color: "#ddf" }}>
              My Website
            </RouterLink>
          </Typography>
        </Box>

        {/* Right: Avatar or Login Button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link component={RouterLink} to={user ? "/profile" : "/auth/login"} style={{ textDecoration: "none" }}>
            {user && user.avatarImage ? (
              <Avatar alt={user.username} src={user.avatarImage} />
            ) : (
              <IconButton sx={{ color: "#ddf" }}>
                <LoginIcon />
              </IconButton>
            )}
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppNavbar;
