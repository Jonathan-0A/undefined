import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { MailOutline, ChatBubbleOutline } from "@mui/icons-material";

function NoMessages() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#1e1e1e",
        padding: 3,
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#292929",
          borderRadius: "50%",
          padding: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
        }}
      >
        <MailOutline
          sx={{
            fontSize: "64px",
            color: "#90caf9",
          }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          color: "#e0e0e0",
          fontWeight: "600",
          mb: 1.5,
        }}
      >
        No Messages Yet
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#b0b0b0",
          maxWidth: "350px",
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        It looks like you haven't started any conversation yet. Send your first message to get things going!
      </Typography>
    </Box>
  );
}

export default NoMessages;
