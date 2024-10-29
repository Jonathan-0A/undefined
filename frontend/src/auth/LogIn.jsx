import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Box, Typography, 
    TextField, Button, Grid, Card, 
    CardContent, CircularProgress, 
    InputAdornment, IconButton, 
    Tooltip} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";

function LoginPage({ updateUser, user }) { // Accept updateUser as a prop
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [load, setLoad] = useState(false);
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoad(true)
        setErrors({});

        if (!formData.email) {
            setErrors({ email: "Email is required!" });
            return;
        }
        if (!formData.password) {
            setErrors({ password: "Password is required!" });
            return;
        }

        axios.post("/auth/login", formData, {
            withCredentials: true,
        }).then((res) => {
            const user = res.data.user; // Assuming response contains user data in res.data.user
            updateUser(user); // Set user state using updateUser
            toast.success(res.data.message);
            navigate("/"); // Navigate to profile page after login
            setLoad(false)
        })
            .catch((err) => {
                console.log(err)
                toast.error(err?.response?.data?.message || "Login failed");
                setLoad(false);
            });
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff" }}>
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Card raised sx={{
                    backgroundColor: "#1e1e1e",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.7)",
                    borderRadius: "12px",
                }}>
                    <CardContent>
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#bb86fc" }}>
                                Login
                            </Typography>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <TextField
                                    required
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        style: { color: "#ffffff" },
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#bbbbbb" },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#bb86fc",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#bb86fc",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#bb86fc",
                                            },
                                        },
                                    }}
                                    error={errors.email}
                                    helperText={errors.email}
                                />
                                <TextField
                                    required
                                    label="Password"
                                    variant="outlined"
                                    type={show?"text":"password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        style: { color: "#ffffff" },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton color="primary">
                                                    {
                                                        !show ? (
                                                            <Tooltip title="Show Password">
                                                                <Visibility onClick={() => setShow(true)} />
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Hide Password">
                                                                <VisibilityOff onClick={() => setShow(false)} />
                                                            </Tooltip>
                                                        )
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#bbbbbb" },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#bb86fc",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#bb86fc",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#bb86fc",
                                            },
                                        },
                                    }}
                                    error={errors.password}
                                    helperText={errors.password}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        alignSelf: "center",
                                        mt: 2,
                                        backgroundColor: "#bb86fc",
                                        color: "#000",
                                        "&:hover": {
                                            backgroundColor: "#9a67ea",
                                        },
                                        width: "125px",
                                        height: "45px",
                                        borderRadius: "8px",
                                        fontWeight: "bold",
                                    }}>
                                    {
                                        load ? (
                                            <CircularProgress size={27} sx={{ color: "#000" }} />
                                        ) : "Log In"
                                    }
                                </Button>
                            </Box>
                        </form>

                        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                            <Grid item>
                                <Link to="/auth/forgot-password" variant="body2" sx={{ color: "#bb86fc" }}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Typography>
                                    Don't have an account?{" "}
                                    <Link to="/auth/signup" variant="body2" sx={{ color: "#bb86fc" }}>
                                        Sign up
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}

export default LoginPage;
