import React, { useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import NoMessages from "../ChatSpace/NoMessages";
import { Done, ScheduleSend } from '@mui/icons-material';

const MessageList = ({ messages = [], user, sent }) => {
  // useEffect(() => {
  //   console.log("MessageList received messages:", messages);
  // }, [messages]);

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2, paddingBottom: 10 }}>
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => {
          const isSender = msg.senderId === user._id;

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 2,
                justifyContent: isSender ? "flex-end" : "flex-start",
              }}
            >
              {/* Receiver's Avatar */}
              {!isSender && (
                <Avatar
                  src={msg.receiverAvatar || "https://i.pravatar.cc/150?img=3"}
                  sx={{ width: 36, height: 36, marginRight: 1 }}
                />
              )}

              <Box
                sx={{
                  backgroundColor: isSender ? "#3968de" : "#2a2a2a",
                  color: "#ddf",
                  padding: "4px 7px",
                  borderRadius: "9px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                  boxShadow: isSender
                    ? "0 2px 6px rgba(0, 122, 255, 0.3)"
                    : "0 2px 6px rgba(30, 30, 30, 0.3)",
                  position: "relative",
                  transition: "background-color 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: isSender
                      ? "0 4px 8px rgba(0, 122, 255, 0.5)"
                      : "0 4px 8px rgba(30, 30, 30, 0.5)",
                  },
                }}
              >
                {/* Message Text */}
                <Typography variant="body1" sx={{ fontSize: 15, lineHeight: 1.6 }}>
                  {msg.message}
                </Typography>

                {/* Timestamp and Status Icons */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: "5px",
                    gap: "5px",
                    color: "#b3b3b3",
                    fontSize: "12px",
                  }}
                >
                  <Typography variant="caption">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  {isSender && (
                    sent ? (
                      <Done sx={{ fontSize: 16, color: "#90caf9" }} />
                    ) : (
                      <ScheduleSend sx={{ fontSize: 16, color: "#888" }} />
                    )
                  )}
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <NoMessages />
      )}
    </Box>
  );
};

export default MessageList;
