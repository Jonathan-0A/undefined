import React, { useEffect } from "react";
import { Typography, Box, Button, Container, Grid, Card, CardContent } from "@mui/material";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

function HomePage({ user }) {
    useEffect(() => {
        // Initialize socket connection
        const socket = io("http://localhost:8553", {
            // transports: ["websocket", "polling"],
            withCredentials: true,
        });

        // Connection confirmation
        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
            toast.success("Connected to Socket.IO server");
        });

        // Error handling for connection issues
        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            toast.error("Socket connection failed");
        });

        // Handle socket disconnection
        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
            console.log("Socket connection closed");
        };
    }, []);

    return (
        <div>
            <Box
                sx={{
                    height: "80vh",
                    backgroundImage: "url(https://source.unsplash.com/random)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textAlign: "center",
                    p: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                }}
            >
                <Container>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#bb86fc" }}>
                        Welcome to My Website
                    </Typography>
                    <Typography variant="h6" component="p" gutterBottom sx={{ color: "#e0e0e0" }}>
                        A modern website built with React and Material-UI
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 3,
                            px: 4,
                            py: 1,
                            fontSize: "1rem",
                            borderRadius: "20px",
                            backgroundColor: "#03dac6",
                            color: "#000000",
                            '&:hover': {
                                backgroundColor: "#00c4b4",
                            },
                        }}
                    >
                        Get Started
                    </Button>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: "#bb86fc" }}>
                    Features of Our Service
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 4, color: "#e0e0e0" }}>
                    Discover the amazing features we offer.
                </Typography>

                <Grid container spacing={4}>
                    {/* Feature 1 */}
                    <Grid item xs={12} md={4}>
                        <Card raised sx={{ backgroundColor: "#1e1e1e", color: "#ffffff" }}>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#bb86fc" }}>
                                    Feature 1
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ color: "#b0b0b0" }}>
                                    Description of feature 1 that highlights the main value or service provided.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Feature 2 */}
                    <Grid item xs={12} md={4}>
                        <Card raised sx={{ backgroundColor: "#1e1e1e", color: "#ffffff" }}>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#bb86fc" }}>
                                    Feature 2
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ color: "#b0b0b0" }}>
                                    Description of feature 2 that showcases another key offering.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Feature 3 */}
                    <Grid item xs={12} md={4}>
                        <Card raised sx={{ backgroundColor: "#1e1e1e", color: "#ffffff" }}>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#bb86fc" }}>
                                    Feature 3
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ color: "#b0b0b0" }}>
                                    Description of feature 3 explaining another important benefit.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default HomePage;
