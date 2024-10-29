import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tooltip,
  IconButton,
  Badge,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  LocationOn,
  Email as EmailIcon,
  CameraAlt as CameraIcon,
  LinkedIn,
  GitHub,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const UserProfilePage = React.memo(({ user }) => {
  const navigate = useNavigate();

  const {
    name,
    username,
    email,
    bio = `I am ${user.name}`,
    location,
    avatarImage,
    gender,
    phone,
    createdAt,
    skills,
    experience,
    education,
    interests,
    socialLinks,
  } = user || {};

  const joinedDate = createdAt
    ? moment(new Date(createdAt)).format("Do MMMM, YYYY")
    : "N/A";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        minHeight: "100vh",
        backgroundColor: "#121212",
        padding: 4,
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", sm: "39%" },
          backgroundColor: "#1e1e1e",
          borderRadius: 4,
          padding: 3,
          boxShadow: 2,
          position: "sticky",
          top: 0,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Avatar
              alt={username}
              src={avatarImage}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: "4px solid #90caf9",
                transition: "0.3s",
                ":hover": { transform: "scale(1.05)" },
              }}
              aria-label="User avatar"
            />
          </Badge>
          <Typography
            variant="h5"
            color="#eef"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {name}
          </Typography>
          <Typography variant="subtitle1" color="#dde">
            @{username}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2, bgcolor: "#90caf9" }} />

        <Typography variant="body2" color="#a3a2a0" sx={{ mb: 1 }}>
          <EmailIcon aria-label="email" sx={{ mr: 1 }} /> {email}
        </Typography>
        {
          phone && (
            <Typography variant="body2" color="#a3a2a0" sx={{ mb: 1 }}>
              <PhoneIcon aria-label="phone" sx={{ mr: 1 }} /> {phone}
            </Typography>
          )
        }
        {
          location && (
            <Typography variant="body2" color="#a3a2a0">
              <LocationOn aria-label="location" sx={{ mr: 1 }} /> {location}
            </Typography>
          )
        }

        <Divider sx={{ my: 2, bgcolor: "#90caf9" }} />

        <Typography variant="body1" color="#a3a2a0" sx={{ mb: 1 }}>
          <strong>Gender:</strong> {gender.toUpperCase()}
        </Typography>
        <Typography variant="body1" color="#a3a2a0">
          <strong>Joined:</strong> {joinedDate}
        </Typography>

        <Divider sx={{ my: 2, bgcolor: "#90caf9" }} />

        {/* Edit Profile Button */}
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            height: "47px",
            borderRadius: 7,
            mt: 3,
            background: "linear-gradient(45deg, #9a67ea, #bb86fc)",
            color: "#111",
            width: "100%",
            transition: "0.35s",
            ":hover": {
              background: "linear-gradient(45deg, #bb86fc, #9a67ea)",
            },
          }}
          onClick={() => navigate("/edit-profile")}
          aria-label="Edit profile"
        >
          Edit Profile
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: { xs: "100%", sm: "59%" },
          padding: 3,
          borderRadius: 4,
          backgroundColor: "#1e1e1e",
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" color="#eef" sx={{ mb: 2 }}>
          About Me
        </Typography>
        {bio && (
          <Typography variant="body1" color="#a3a2a0" sx={{ fontStyle: "italic" }}>
            {bio}
          </Typography>
        )}

        <Divider sx={{ my: 4, bgcolor: "#90caf9" }} />

        {/* Skills Section */}
        {
          skills && (
            <>
              {
                skills.length > 0 && (
                  <>
                    <Typography variant="h6" color="#eef" sx={{ mb: 2 }}>
                      Skills
                    </Typography>
                    <Box sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                      flexWrap: "wrap",
                      gap: 3,
                      overflow: "auto"
                    }}>
                      {skills.map((skill, index) => (
                        <Box key={index}>
                          <Chip label={skill} sx={{
                            backgroundColor: "#9a67ea",
                            color: "#111",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                            ":hover": {
                              backgroundColor: "#bb86fc"
                            }
                          }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Divider sx={{ my: 4, bgcolor: "#90caf9" }} />
                  </>
                )
              }
            </>
          )
        }

        {/* Experience Section */}
        {
          experience && (
            <>
              {experience.length > 0 && (
                <>
                  <Typography variant="h6" color="#eef" sx={{ mb: 2 }}>
                    Experience
                  </Typography>
                  {experience.map((job, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="#a3a2a0">
                        <strong>{job.role}</strong> at {job.company} ({job.duration})
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 4, bgcolor: "#90caf9" }} />
                </>
              )}
            </>
          )
        }

        {/* Education Section */}
        {
          education && (
            <>
              {
                education.length > 0 && (
                  <>
                    <Typography variant="h6" color="#eef" sx={{ mb: 2 }}>
                      Education
                    </Typography>
                    {education.map((edu, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="#a3a2a0">
                          <strong>{edu.degree}</strong> from {edu.institution} ({edu.year})
                        </Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 4, bgcolor: "#90caf9" }} />
                  </>
                )
              }
            </>
          )
        }

        {/* Interests Section */}
        {
          interests && (
            <>
              {
                interests.length > 0 && (
                  <>
                    <Typography variant="h6" color="#eef" sx={{ mb: 2 }}>
                      Interests
                    </Typography>
                    <Box sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                      flexWrap: "wrap",
                      gap: 3,
                      overflow: "auto"
                    }}>
                      {interests.map((skill, index) => (
                        <Box key={index}>
                          <Chip label={skill} sx={{
                            backgroundColor: "#9a67ea",
                            color: "#111",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                            ":hover": {
                              backgroundColor: "#bb86fc"
                            }
                          }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Divider sx={{ my: 4, bgcolor: "#90caf9" }} />
                  </>
                )
              }
            </>
          )
        }

        {/* Social Links */}
        {
          socialLinks && (
            <>
              {
                socialLinks.length > 0 && (
                  <>
                    <Typography variant="h6" color="#eef" sx={{ mb: 2 }}>
                      Social Links
                    </Typography>
                    <Box sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                      flexWrap: "wrap",
                      gap: 2,
                      overflow: "auto"
                    }}>
                      {
                        <>
                          {socialLinks.linkedin && (
                            <Box xs={12} sm={6}>
                              <Button
                                variant="contained"
                                startIcon={<LinkedIn />}
                                sx={{
                                  width: "100%",
                                  background: "#0077b5",
                                  ":hover": {
                                    background: "#005582",
                                  },
                                  boxShadow: 2,
                                  transition: "0.3s",
                                  borderRadius: 2,
                                }}
                                onClick={() => window.open(socialLinks?.linkedin, "_blank")}
                              >
                                LinkedIn
                              </Button>
                            </Box>
                          )}
                          {socialLinks.github && (
                            <Box xs={12} sm={6}>
                              <Button
                                variant="contained"
                                startIcon={<GitHub />}
                                sx={{
                                  width: "100%",
                                  background: "#333",
                                  ":hover": {
                                    background: "#444",
                                  },
                                  boxShadow: 2,
                                  transition: "0.3s",
                                  borderRadius: 2,
                                }}
                                onClick={() => window.open(socialLinks?.github, "_blank")}
                              >
                                GitHub
                              </Button>
                            </Box>
                          )}
                        </>
                      }
                    </Box>
                  </>
                )
              }
            </>
          )
        }
      </Box>
    </Box>
  );
});

export default UserProfilePage;
