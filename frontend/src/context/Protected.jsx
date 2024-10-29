import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress, Box } from "@mui/material";

const Protected = ({ element: Element, updateUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data using axios
  const fetchUserData = async () => {
    try {
      const res = await axios.get("/user", {
        withCredentials: true,
        headers: { Accept: "application/json" },
      });

      // Check for successful response
      if (res.status === 200) {
        const data = res.data;
        setUserData({
          _id: data._id,
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
          location: data.location,
          avatarImage: data.avatarImage,
          gender: data.gender,
          createdAt: data.createdAt,
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          interests: data.interests,
          socialLinks: data.socialLinks,
        });
        // Set user globally
        updateUser({
          _id: data._id,
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          avatarImage: data.avatarImage,
          gender: data.gender,
          createdAt: data.createdAt,
        });
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      // Improved error handling
      if (error.response) {
        // Server responded with a status code outside of 2xx
        if (error.response.status === 401) {
          navigate("/auth/login");
        } else if (error.response.status === 404) {
          toast.error("User not found.");
          navigate("/auth/login");
        } else {
          console.error("Error fetching user data:", error);
          toast.error("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return userData ? <Element user={userData} /> : <Navigate to="/auth/login" />;
};

export default Protected;
