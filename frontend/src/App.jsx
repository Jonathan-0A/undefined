import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppNavbar from "./components/AppNavBar";
import "./App.css";
import { LinearProgress, ThemeProvider } from "@mui/material";
import { darkTheme } from "./data/theme";
import LogIn from "./auth/LogIn";
import SignUp from "./auth/SignUp";

// Lazy load your components
const Home = lazy(() => import("./pages/Home"));
const ChatSpace = lazy(() => import("./pages/ChatSpace"));
// const LogIn = lazy(() => import("./auth/LogIn"));
// const SignUp = lazy(() => import("./auth/SignUp"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Protected = lazy(() => import("./context/Protected"));

// Move the functional component for rendering App content into a child of Router
function AppContent({ user, setUser }) {
  const location = useLocation(); // Now, it's inside the Router
  const authRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/chat-space"]; // Define routes where navbar should be hidden

  return (
    <>
      <Toaster />
      {!authRoutes.includes(location.pathname) && <AppNavbar user={user} />}
      <Suspense fallback={<LinearProgress />}>
        <Routes>
          <Route path="/" element={<Protected element={Home} updateUser={setUser} />} />
          <Route path="/chat-space" element={<Protected element={ChatSpace} updateUser={setUser} />} />
          <Route path="/profile" element={<Protected element={Profile} updateUser={setUser} />} />
          <Route path="/edit-profile" element={<Protected element={EditProfile} updateUser={setUser} />} />
          <Route path="/auth/login" element={<LogIn user={user} updateUser={setUser} />} />
          <Route path="/auth/signup" element={<SignUp user={user} updateUser={setUser} />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword user={user} updateUser={setUser} />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null); // Store user data globally

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <AppContent user={user} setUser={setUser} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
