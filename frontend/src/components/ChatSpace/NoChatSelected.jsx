import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";

const NoChatSelected = ({ refreshUsers }) => {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#1e1e1e",
                color: "#ffffff",
                padding: { xs: 2, md: 4 },
                textAlign: "center",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
            }}
        >
            <ChatBubbleOutline
                sx={{
                    fontSize: { xs: 60, md: 100 },
                    color: "#007aff",
                    marginBottom: { xs: 1, md: 3 },
                }}
            />
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    marginBottom: { xs: 1, md: 2 },
                }}
            >
                No Conversation Selected
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: "#b0b0b0",
                    marginBottom: { xs: 2, md: 4 },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    maxWidth: { xs: "90%", md: "400px" },
                }}
            >
                Select a user from the list to start chatting with them.
            </Typography>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#007aff",
                    "&:hover": { backgroundColor: "#005bb5" },
                }}
                onClick={refreshUsers} // Or any other action
            >
                Refresh User List
            </Button>
        </Box>
    );
};

export default NoChatSelected;
