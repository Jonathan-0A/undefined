import React from "react";
import { Avatar, CircularProgress, List, ListItem, ListItemText, Box } from "@mui/material";
import useConversation from "../../states/useConversation.js";

function UsersList({ users, loading }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  
  return (
    <List>
      {loading ? (
        <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress size={39} />
        </Box>
      ) : (
        users.map((u) => (
          <ListItem key={u._id} 
            sx={{ padding: 1, borderRadius: 2, 
              "&:hover": { backgroundColor: "#333" },
              backgroundColor: `${selectedConversation?._id === u._id ? "#333" : ""}`
            }}
            onClick={() => setSelectedConversation(u)}
          >
            <Avatar alt={u.username} src={u.avatarImage} sx={{ mr: 3, width: 45, height: 45 }} />
            <Box>
              <ListItemText primary={u.name} primaryTypographyProps={{ style: { color: "#ddf", fontWeight: "500", fontSize: "17px" } }} />
              <ListItemText secondary={u.username} secondaryTypographyProps={{ style: { color: "#889", fontWeight: "300", fontSize: "15px" } }} />
            </Box>
          </ListItem>
        ))
      )}
    </List>
  );
}

export default UsersList;
