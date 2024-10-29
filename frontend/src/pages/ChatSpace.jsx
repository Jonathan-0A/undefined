import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Avatar, TextField, InputAdornment, IconButton, CircularProgress, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import SideBar from "../components/SideBar.jsx";
import ChatNavbar from "../components/ChatSpace/ChatNavBar.jsx";
import UserList from "../components/ChatSpace/UserList.jsx";
import MessageList from "../components/ChatSpace/MessageList.jsx";
import useConversation from "../states/useConversation.js";
import useGetMessage from "../context/useGetMessage.js";
import NoChatSelected from "../components/ChatSpace/NoChatSelected.jsx";
import { io } from "socket.io-client";

function ChatSpace({ user }) {
  const { messages, loadMsg, setMessages } = useGetMessage();
  const [loadUser, setLoadUser] = useState(false);
  const [msgSent, setMsgSent] = useState(true);
  const [users, setUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messageEndRef = useRef(null);
  const { selectedConversation } = useConversation();
  const [selectedUser, setSelectedUser] = useState(null);
  const socketUrl = "http://localhost:8553";
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(socketUrl, {
      withCredentials: true,
    });

    // Confirm connection
    socketRef.current.on("connectionConfirmed", (message) => {
      console.log(message);
      toast.success(message);
    });

    // Listen for incoming messages
    socketRef.current.on("message", (data) => {
      // console.log("New message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
      console.log("Socket disconnected from Chat component.");
    };
  }, [socketUrl]);

  const fetchAllUsers = async () => {
    setLoadUser(true);
    try {
      const res = await axios.get("/user/all");
      if (res.status === 200) {
        setUsers(res.data.allUsers);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoadUser(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setSelectedUser(selectedConversation);
      setInputMessage(""); // Clear input on conversation change
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    const messageData = {
      message: inputMessage,
      senderId: user?._id || "Anonymous",
      receiverId: selectedUser?._id || "Anonymous",
      timestamp: Date.now(),
    };

    try {
      if (!selectedUser) {
        throw new Error("No recipient selected");
      }

      const res = await axios.post(`/message/send/${selectedUser._id}`, messageData);
      setMsgSent(true);
      setInputMessage("");
      socketRef.current.emit("clientMessage", messageData);
    } catch (err) {
      console.error("Error sending message: ", err.response || err);
      setMsgSent(false);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div style={{ color: "#ffffff", height: "100vh", backgroundColor: "#121212", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexGrow: 1, height: "100%", overflow: "hidden" }}>
        <Grid container sx={{ flexGrow: 1, height: "100%" }}>
          {/* Users List Section */}
          <Grid item xs={12} md={3} sx={{ backgroundColor: "#1e1e1e", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", height: "100%", borderRight: "1px solid #555", overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column" }}>
            <Box sx={{ color: "#ffffff", mb: 3, margin: "5px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SideBar />
              <Link to="/profile">
                <Avatar src={user?.avatarImage} sx={{ "&:hover": { cursor: "pointer" } }} />
              </Link>
            </Box>
            <UserList users={users} loading={loadUser} />
          </Grid>

          {/* Messages Section */}
          <Grid item xs={12} md={9} sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#1e1e1e", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            {selectedUser ? (
              <>
                <ChatNavbar user={selectedUser} />
                {loadMsg ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <CircularProgress color="primary" />
                  </Box>
                ) : (
                  <MessageList messages={messages} sent={msgSent} user={user} /> // Updated here
                )}
                <div ref={messageEndRef} />
                <Box component={"form"} onSubmit={handleSendMessage} noValidate autoComplete={"off"} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, backgroundColor: "#121212", borderTop: "1px solid #555", zIndex: 1 }}>
                  <TextField
                    placeholder="Type your message"
                    fullWidth
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    sx={{ backgroundColor: "#1e1e1e", borderRadius: "6px", input: { color: "#ddf", "&::placeholder": { color: "#888" } } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton type="submit" sx={{ "&:hover": { color: "#90caf9" } }}>
                            <Send sx={{ color: "primary.main" }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </>
            ) : (
              <NoChatSelected refreshUsers={fetchAllUsers} />
            )}
          </Grid>

        </Grid>
      </Box>
    </div>
  );
}

export default ChatSpace;
