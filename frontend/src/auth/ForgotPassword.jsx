import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";

function ForgotPasswordPage({user, updateUser}) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        if (!email) {
            setErrors({ email: "Email is required!" });
            setLoading(false);
            return;
        }

        axios.post("/auth/forgot-password", { email })
            .then((res) => {
                toast.success("Password reset link sent to your email!");
                setLoading(false);
            })
            .catch((err) => {
                const errorResponse = err?.response?.data;
                if (errorResponse?.message) {
                    toast.error(errorResponse.message);
                }

                if (errorResponse?.fieldErrors) {
                    setErrors(errorResponse.fieldErrors);
                }

                setLoading(false);
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
                                Forgot Password
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
                                    value={email}
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
                                    error={!!errors.email}
                                    helperText={errors.email}
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
                                        loading ? (
                                            <CircularProgress size={27} sx={{ color: "#000" }} />
                                        ) : "Submit"
                                    }
                                </Button>
                            </Box>
                        </form>

                        <Box sx={{ mt: 3, textAlign: "center" }}>
                            <Link to="/auth/login" style={{ color: "#bb86fc", textDecoration: "none" }}>
                                Back to Login
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}

export default ForgotPasswordPage;
