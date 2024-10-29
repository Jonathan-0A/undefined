import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Container, Box, Typography,
    Grid, TextField, Button,
    Card, CardContent, CircularProgress,
    Radio, RadioGroup, FormControlLabel,
    FormLabel, Stepper, Step,
    StepLabel, Checkbox, FormControl,
    InputAdornment, Tooltip
} from "@mui/material";
import { IconButton } from "@mui/material";
import { ChangeCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignupPage({ updateUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        gender: "male",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        bio: "",
        agreedToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(0);
    const [load, setLoad] = useState(false);
    const [show, setShow] = useState(false);
    const [confShow, setConfShow] = useState(false);

    const steps = ["Basic Info", "Contact Info", "Security & Bio", "Finish"];

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Generate username based on name
    const generateUsername = () => {
        const name = formData.name.trim().toLowerCase();
        if (!name) return;
        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        const styles = [
            `${firstName}_${lastName}`,
            `__${firstName}_${lastName}__`,
            `__${firstName[0]}_${lastName}__`,
            `${firstName[0]}_${lastName}`,
            `${firstName[0]}${lastName}`,
            `${firstName}.${lastName}`,
            `${firstName}${Math.floor(Math.random() * 100)}`,
            `${lastName}${Math.floor(Math.random() * 100)}`,
            `The${firstName}`,
            `Real${lastName}`,
        ];
        const randomIndex = Math.floor(Math.random() * styles.length);
        return styles[randomIndex];
    };

    // Automatically generate username when name changes
    useEffect(() => {
        if (formData.name) {
            const generatedUsername = generateUsername();
            if (generatedUsername) {
                setFormData((prevData) => ({
                    ...prevData,
                    username: generatedUsername
                }));
            }
        }
    }, [formData.name]);

    const handleGenerateUsername = () => {
        const generatedUsername = generateUsername();
        if (generatedUsername) {
            setFormData((prevData) => ({
                ...prevData,
                username: generatedUsername
            }));
        }
    };

    // Handle next step
    const handleNext = () => {
        setErrors({});
        if (step === 0 && (!formData.name || !formData.username || !formData.gender)) {
            setErrors({ basicInfo: "Please fill out all fields" });
            return;
        }
        if (step === 1 && (!formData.email || !formData.phone)) {
            setErrors({ contactInfo: "Email and phone are required" });
            return;
        }
        if (step === 2) {
            if (!formData.password || formData.password.length < 6) {
                setErrors({ password: "Password must be at least 6 characters long" });
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setErrors({ password: "Passwords must match" });
                return;
            }
        }
        if (step === 3 && !formData.agreedToTerms) {
            setErrors({ agreedToTerms: "You must agree to the terms and conditions" });
            return;
        }
        setStep((prevStep) => prevStep + 1);
    };

    // Handle previous step
    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
    };

    // Submit the form
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoad(true);

        axios.post("/auth/signup", formData, { withCredentials: true })
            .then((res) => {
                const user = res.data.user;
                updateUser(user);
                toast.success("Signup successful!");
                navigate("/auth/login");
            })
            .catch((err) => {
                const errorResponse = err?.response?.data;
                if (errorResponse?.message) {
                    toast.error(errorResponse.message);
                }
                if (errorResponse?.fieldErrors) {
                    setErrors(errorResponse.fieldErrors);
                }
                setLoad(false);
            });
    };

    // Move to the next step when Enter key is pressed
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [step, formData]);

    // Handle step click to jump to a specific step
    const handleStepClick = (index) => {
        if (index < step) { // Only allow going back to previous steps
            setStep(index);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Card raised sx={{
                backgroundColor: "#1e1e1e",
                color: "#fff",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.7)",
                borderRadius: "12px",
            }}>
                <CardContent>
                    <Stepper activeStep={step} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label} onClick={() => handleStepClick(index)}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        {step === 0 && (
                            <Box>
                                <TextField
                                    required
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ style: { color: "#ffffff" } }}
                                    InputLabelProps={{ style: { color: "#bbbbbb" } }}
                                />
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                                    <TextField
                                        required
                                        label="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        InputProps={{ style: { color: "#ffffff" } }}
                                        InputLabelProps={{ style: { color: "#bbbbbb" } }}
                                    />
                                    <IconButton
                                        onClick={handleGenerateUsername}
                                        disabled={!formData.name.trim()}
                                        sx={{ color: "#bb86fc", ml: 1 }}
                                    >
                                        <ChangeCircle />
                                    </IconButton>
                                </Box>
                                <FormControl>
                                    <FormLabel sx={{ color: "#bbbbbb", mt: 2 }}>Gender</FormLabel>
                                    <RadioGroup
                                        row
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="male" control={<Radio sx={{ color: "#bb86fc" }} />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio sx={{ color: "#bb86fc" }} />} label="Female" />
                                        <FormControlLabel value="non-binary" control={<Radio sx={{ color: "#bb86fc" }} />} label="Non-binary" />
                                    </RadioGroup>
                                </FormControl>
                                {errors.basicInfo && <Typography color="error">{errors.basicInfo}</Typography>}
                            </Box>
                        )}

                        {step === 1 && (
                            <Box>
                                <TextField
                                    required
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ style: { color: "#ffffff" } }}
                                    InputLabelProps={{ style: { color: "#bbbbbb" } }}
                                />
                                <TextField
                                    required
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ style: { color: "#ffffff" } }}
                                    InputLabelProps={{ style: { color: "#bbbbbb" } }}
                                />
                                {errors.contactInfo && <Typography color="error">{errors.contactInfo}</Typography>}
                            </Box>
                        )}

                        {step === 2 && (
                            <Box>
                                <TextField
                                    required
                                    label="Password"
                                    type={show?"text":"password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
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
                                    InputLabelProps={{ style: { color: "#bbbbbb" } }}

                                />
                                <TextField
                                    required
                                    label="Confirm Password"
                                    type={confShow?"text":"password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        style: { color: "#ffffff" },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton color="primary">
                                                    {
                                                        !confShow ? (
                                                            <Tooltip title="Show Password">
                                                                <Visibility onClick={() => setConfShow(true)} />
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Hide Password">
                                                                <VisibilityOff onClick={() => setConfShow(false)} />
                                                            </Tooltip>
                                                        )
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    InputLabelProps={{ style: { color: "#bbbbbb" } }}
                                />
                                <TextField
                                    label="Bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ style: { color: "#ffffff" } }}
                                    InputLabelProps={{ style: { color: "#bbbbbb" } }}
                                />
                                {errors.password && <Typography color="error">{errors.password}</Typography>}
                            </Box>
                        )}

                        {step === 3 && (
                            <Box>
                                <FormControl required>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="agreedToTerms"
                                                checked={formData.agreedToTerms}
                                                onChange={handleChange}
                                                sx={{ color: "#bb86fc" }}
                                            />
                                        }
                                        label="I agree to the terms and conditions"
                                    />
                                    {errors.agreedToTerms && <Typography color="error">{errors.agreedToTerms}</Typography>}
                                </FormControl>
                            </Box>
                        )}

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                            {step > 0 && (
                                <Button variant="outlined" color="secondary" onClick={handleBack}>
                                    Back
                                </Button>
                            )}
                            {step < steps.length - 1 ? (
                                <Button variant="contained" color="primary" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" type="submit" disabled={load}>
                                    {load ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                        <Grid item>
                            <Link to="/auth/forgot-password" variant="body2" sx={{ color: "#bb86fc" }}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Typography>
                                Don't have an account?{" "}
                                <Link to="/auth/login" variant="body2" sx={{ color: "#bb86fc" }}>
                                    Log In
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}

export default SignupPage;
