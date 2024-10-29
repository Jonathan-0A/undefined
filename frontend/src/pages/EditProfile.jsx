import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Avatar,
    Box,
    Button,
    MenuItem,
    IconButton,
    CircularProgress,
    Divider,
    Chip,
    Tooltip,
} from "@mui/material";
import { PhotoCamera, AddCircleOutline, Delete } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = ({ user }) => {
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    // Dummy data for pre-filled fields
    const initial = {
        name: user.name || "John Doe",
        username: user.username || "johndoe21",
        email: user.email || "johndoe@example.com",
        bio: user.bio || "Software Engineer with a passion for web development and open-source technologies.",
        location: user.location || "New York, USA",
        avatarImage: user.avatarImage || "https://i.pravatar.cc/150?img=3",
        gender: user.gender || "male",
        phone: user.phone || "(123) 456-7890",
        skills: user.skills || ["HTML", "CSS", "JavaScript", "React JS", "Node JS", "MongoDB"],
        experience: user.experience || [
            { company: "Tech Corp", role: "Software Engineer", duration: "2019 - Present" },
            { company: "Web Solutions", role: "Frontend Developer", duration: "2017 - 2019" },
        ],
        education: user.education || [
            { institution: "University of Engineering and Management", degree: "B.Tech. CSE", year: "2028" },
        ],
        interests: user.interests || ["Coding", "Music", "Traveling", "Gaming"],
        socialLinks: user.socialLinks || {
            linkedin: user.socialLinks && user.socialLinks.linkedin ? user.socialLinks.linkedin : "https://www.linkedin.com/in/johndoe21/",
            github: user.socialLinks && user.socialLinks.github ? user.socialLinks.github : "https://github.com/Jonathan-0A"
        }
    };
    const [formData, setFormData] = useState(initial);
    const [newEducation, setNewEducation] = useState({ institution: "", degree: "", year: "" });
    const [newExperience, setNewExperience] = useState({ company: "", role: "", duration: "" });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name.startsWith('socialLinks.')) {
            const key = name.split('.')[1];
            setFormData((prevData) => ({
                ...prevData,
                socialLinks: {
                    ...prevData.socialLinks,
                    [key]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        const fileSize = file.size;
        // const minFileSize = 1024 * 1024;  // 1 MB in bytes
        const maxFileSize = 1024 * 1024 * 50;  // 50 MB in bytes
        if(fileSize > maxFileSize){
            toast.error("File size to too high")
        }
        else{
            if (file) {
                setFormData({ ...formData, avatarImage: file }); // Update formData with the selected file
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
    
        // Create a FormData object to handle both file and non-file inputs
        const data = new FormData();
    
        // Append non-file fields to FormData
        Object.keys(formData).forEach(key => {
            if (key === "avatarImage" && formData.avatarImage instanceof File) {
                // Append the avatar image if it's a file
                data.append("photo", formData.avatarImage);
            } else if (Array.isArray(formData[key]) || typeof formData[key] === "object") {
                // Stringify arrays and objects before appending
                data.append(key, JSON.stringify(formData[key]));
            } else {
                // Append other fields directly (text, numbers, etc.)
                data.append(key, formData[key]);
            }
        });
    
        try {
            await axios.put("/user/edit-profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data", // Required for file uploads
                },
                withCredentials: true, // In case you're using cookies for authentication
            });
            toast.success("Profile updated successfully.");
            navigate("/profile");
        } catch (err) {
            toast.error("Failed to update profile.");
            console.error("Error updating profile:", err);
        } finally {
            setLoad(false);
        }
    };
    const handleAddSkill = () => {
        setFormData({ ...formData, skills: [...formData.skills, ""] });
    };
    const handleAddInterest = () => {
        setFormData({ ...formData, interests: [...formData.interests, ""] });
    };
    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setNewEducation((prev) => ({ ...prev, [name]: value }));
    };
    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setNewExperience((prev) => ({ ...prev, [name]: value }));
    };
    const addEducation = () => {
        setFormData((prev) => ({
            ...prev,
            education: [...prev.education, newEducation],
        }));
        setNewEducation({ institution: "", degree: "", year: "" }); // Reset the input fields
    };
    const addExperience = () => {
        setFormData((prev) => ({
            ...prev,
            experience: [...prev.experience, newExperience],
        }));
        setNewExperience({ company: "", role: "", duration: "" }); // Reset the input fields
    };
    const removeEducation = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            education: prev.education.filter((_, index) => index !== indexToRemove),
        }));
    };
    const removeExperience = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            experience: prev.experience.filter((_, index) => index !== indexToRemove),
        }));
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#1a1a1a",
                padding: 2,
            }}
        >
            <Card
                sx={{
                    width: "97%",
                    padding: 4,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                    borderRadius: 5,
                    backgroundColor: "#2c2c2c",
                    color: "#fafafa",
                }}
            >
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom sx={{ color: "#eef" }}>
                        Edit Profile
                    </Typography>
                    {/* Avatar and name */}
                    <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
                        <Avatar src={formData.avatarImage} sx={{ width: 100, height: 100, mr: 2 }} />
                        <IconButton
                            color="primary"
                            component="label"
                            sx={{
                                backgroundColor: "#333",
                                color: "#fff",
                                ":hover": { backgroundColor: "#555" },
                            }}
                        >
                            <input hidden accept="image/*" type="file" max={52428800} onChange={handleAvatarChange} />
                            <PhotoCamera />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ color: "#9a67ea", mb: 2 }}>
                        Personal Details
                    </Typography>
                    {/* Name, Username, Email */}
                    <Box display="flex" justifyContent="space-between" mb={3}>
                        <TextField
                            fullWidth
                            required
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                width: "32%",
                                backgroundColor: "#2c2c2c",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea", // Purple for hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea", // Purple for focused
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        />
                        <TextField
                            fullWidth
                            required
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                width: "32%",
                                backgroundColor: "#2c2c2c",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        />
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                width: "32%",
                                backgroundColor: "#2c2c2c",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        />
                    </Box>
                    {/* Bio */}
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            label="About"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            variant="outlined"
                            multiline
                            rows={3}
                            sx={{
                                backgroundColor: "#2c2c2c",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "& .MuiInputBase-input": {
                                        color: "#eef",
                                    },
                                    "& .MuiInputBase-input textarea": {
                                        color: "#eef",
                                    },
                                    "& .MuiInputBase-input input": {
                                        color: "#eef",
                                    },
                                },
                                label: { color: "#9a67ea" }, // Updated to change label color
                                input: { color: "#eef", "textarea": { color: "#eef" } }, // Ensure text color for textarea
                            }}
                        />
                    </Box>
                    {/* Location, Gender, Phone */}
                    <Box display="flex" justifyContent="space-between" mb={3}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                width: "32%",
                                backgroundColor: "#2c2c2c",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea", // Purple for hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea", // Purple for focused
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        />
                        <TextField
                            select
                            fullWidth
                            required
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                width: "32%",
                                backgroundColor: "#2c2c2c",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "& .MuiSelect-select": {
                                        color: "#eef",
                                    },
                                    "& .MuiSelect-icon": {
                                        color: "#9a67ea",
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                width: "32%",
                                backgroundColor: "#2c2c2c",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        />
                    </Box>

                    {/* Skills and Interests */}
                    <Box display="flex" justifyContent="space-between" mb={3}>
                        <Box sx={{ width: "48%" }}>
                            <Typography variant="h6" sx={{ color: "#9a67ea", mb: 2 }}>
                                Skills
                            </Typography>
                            {formData.skills.map((skill, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    label={`Skill ${index + 1}`}
                                    value={skill}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            skills: formData.skills.map((s, i) =>
                                                i === index ? e.target.value : s
                                            ),
                                        })
                                    }
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleOutline />}
                                onClick={handleAddSkill}
                                sx={{
                                    mt: 1,
                                    backgroundColor: "#444",
                                    borderColor: "#9a67ea",
                                    color: "#9a67ea",
                                    ":hover": { borderColor: "#9a67ea", backgroundColor: "#333" },
                                }}
                            >
                                Add Skill
                            </Button>
                        </Box>
                        <Box sx={{ width: "48%" }}>
                            <Typography variant="h6" sx={{ color: "#9a67ea", mb: 2 }}>
                                Interests
                            </Typography>
                            {formData.interests.map((interest, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    label={`Interest ${index + 1}`}
                                    value={interest}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            interests: formData.interests.map((i, idx) =>
                                                idx === index ? e.target.value : i
                                            ),
                                        })
                                    }
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                            ))}

                            <Button
                                variant="outlined"
                                startIcon={<AddCircleOutline />}
                                onClick={handleAddInterest}
                                sx={{
                                    mt: 1,
                                    backgroundColor: "#444",
                                    borderColor: "#9a67ea",
                                    color: "#9a67ea",
                                    ":hover": { borderColor: "#9a67ea", backgroundColor: "#333" },
                                }}
                            >
                                Add Interest
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ width: "48%" }}>
                            <Typography variant="h6" sx={{ color: "#9a67ea", mb: 2 }}>
                                Education
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="Institution"
                                    name="institution"
                                    value={newEducation.institution}
                                    onChange={handleEducationChange}
                                    fullWidth
                                    required
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                                <TextField
                                    label="Degree"
                                    name="degree"
                                    value={newEducation.degree}
                                    onChange={handleEducationChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                                <TextField
                                    label="Year"
                                    name="year"
                                    value={newEducation.year}
                                    onChange={handleEducationChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                                <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={addEducation}
                                    sx={{
                                        mt: 1,
                                        backgroundColor: "#444",
                                        borderColor: "#9a67ea",
                                        color: "#9a67ea",
                                        ":hover": { borderColor: "#9a67ea", backgroundColor: "#333" },
                                    }}
                                >
                                    Add Education
                                </Button>
                            </Box>
                            {formData.education.length > 0 && (
                                <Box>
                                    <Typography variant="h6" color="#9a67ea" sx={{
                                        mb: 1,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}>
                                        Current Education
                                    </Typography>
                                    {formData.education.map((edu, index) => (
                                        <Box
                                            key={index}
                                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                                        >
                                            <Chip key={index} label={`${edu.degree} from ${edu.institution} (${edu.year})`}
                                                sx={{
                                                    mb: 1, mr: 1, color: "#ddf",
                                                    border: "1px solid #9a67ea"
                                                }}
                                            />
                                            <IconButton
                                                onClick={() => removeEducation(index)}
                                                sx={{ color: "#ff6e6e" }}
                                            >
                                                <Tooltip title="delete">
                                                    <Delete />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ width: "48%" }}>
                            <Typography variant="h6" sx={{ color: "#9a67ea", mb: 2 }}>
                                Experience
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="Company"
                                    name="company"
                                    value={newExperience.company}
                                    onChange={handleExperienceChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                                <TextField
                                    label="Role"
                                    name="role"
                                    value={newExperience.role}
                                    onChange={handleExperienceChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                                <TextField
                                    label="Duration"
                                    name="duration"
                                    value={newExperience.duration}
                                    onChange={handleExperienceChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#2c2c2c",
                                        mb: 2,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}
                                />
                                <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={addExperience}
                                    sx={{
                                        mt: 1,
                                        backgroundColor: "#444",
                                        borderColor: "#9a67ea",
                                        color: "#9a67ea",
                                        ":hover": { borderColor: "#9a67ea", backgroundColor: "#333" },
                                    }}
                                >
                                    Add Experience
                                </Button>
                            </Box>
                            {formData.experience.length > 0 && (
                                <Box>
                                    <Typography variant="h6" color="#9a67ea" sx={{
                                        mb: 1,
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#606060",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9a67ea",
                                            },
                                        },
                                        label: { color: "#9a67ea" },
                                        input: { color: "#eef" },
                                    }}>
                                        Current Experience
                                    </Typography>
                                    {formData.experience.map((job, index) => (
                                        <Box
                                            key={index}
                                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                                        >
                                            <Chip key={index} label={`${job.role} at ${job.company} (${job.duration})`}
                                                sx={{
                                                    mb: 1, mr: 1, color: "#ddf",
                                                    border: "1px solid #9a67ea"
                                                }}
                                            />
                                            <IconButton
                                                onClick={() => removeExperience(index)}
                                                sx={{ color: "#ff6e6e" }}
                                            >
                                                <Tooltip title="delete">
                                                    <Delete />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                    {/* Social Links */}
                    <Typography variant="h6" sx={{ color: "#9a67ea", mb: 2 }}>
                        Social Links
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={3}>
                        <TextField
                            fullWidth
                            label="LinkedIn URL"
                            name="socialLinks.linkedin"
                            value={formData.socialLinks.linkedin}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                backgroundColor: "#2c2c2c",
                                width: "48%",
                                mb: 2,
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="GitHub URL"
                            name="socialLinks.github"
                            value={formData.socialLinks.github}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                backgroundColor: "#2c2c2c",
                                width: "48%",
                                mb: 2,
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#606060",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#9a67ea",
                                    },
                                },
                                label: { color: "#9a67ea" },
                                input: { color: "#eef" },
                            }}
                        />
                    </Box>
                    <Divider sx={{ mb: 3, borderColor: "#606060" }} />
                    {/* Submit Button */}
                    <Box display="flex" justifyContent="space-around" mt={6}>
                        <Button
                            variant="contained"
                            sx={{
                                width: "45%",
                                height: "51px",
                                borderRadius: 7,
                                mr: 2,
                                backgroundColor: "#9a67ea", // Purple for the main button
                                ":hover": { backgroundColor: "#7a56c6" }, // Darker purple on hover
                            }}
                            onClick={handleSubmit}
                            disabled={load}
                        >
                            {load ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Save"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => navigate("/profile")}
                            sx={{
                                width: "45%",
                                height: "51px",
                                borderRadius: 7,
                                backgroundColor: "#444",
                                borderColor: "#e57373",
                                color: "#e57373",
                                ":hover": { borderColor: "#ef5350", backgroundColor: "#333" },
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditProfile;
