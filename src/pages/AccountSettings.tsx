import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  EmailOutlined,
  PhoneOutlined,
  WorkOutlined,
} from "@mui/icons-material";

import { useState } from "react";

import { useAuth } from "../context/useAuth";

import { updateProfile, changePassword } from "../services/profileApi";

import type {
  ProfileData as ProfileType,
  PasswordData,
} from "../types/profile";

export default function AccountSettings() {
  const { currentUser, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const [profile, setProfile] = useState<ProfileType>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    department: currentUser?.department || "",
    bio: currentUser?.bio || "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",

    newPassword: "",
  });

  const avatarLetter = currentUser?.name?.charAt(0)?.toUpperCase() || "U";

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await updateProfile(profile);

      localStorage.setItem("user", JSON.stringify(response.data));

      setCurrentUser(response.data);

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordUpdate = async () => {
    try {
      await changePassword(passwordData);

      alert("Password updated successfully");

      setPasswordData({
        currentPassword: "",

        newPassword: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* MAIN LAYOUT */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            md: "340px 1fr",
          },

          gap: 4,
        }}
      >
        {/* LEFT PROFILE CARD */}

        <Card
          sx={{
            borderRadius: 5,
            p: 4,
            height: "fit-content",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 110,
                height: 110,
                fontSize: 40,
                fontWeight: 700,
                mb: 2,
                bgcolor: "rgba(255,255,255,0.2)",
              }}
            >
              {avatarLetter}
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              {profile.name}
            </Typography>

            <Typography
              sx={{
                opacity: 0.8,
                mb: 2,
              }}
            >
              {profile.email}
            </Typography>

            <Chip
              label={
                currentUser?.role === "admin" ? "Administrator" : "Team Member"
              }
              sx={{
                bgcolor: "white",
                color: "#4f46e5",
                fontWeight: 600,
                mb: 3,
              }}
            />

            <Divider
              sx={{
                my: 4,
                width: "100%",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            />

            <Box
              sx={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <EmailOutlined />

                <Typography>{profile.email}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <PhoneOutlined />

                <Typography>{profile.phone || "No phone added"}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <WorkOutlined />

                <Typography>{profile.department || "No department"}</Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* RIGHT CONTENT */}

        <Paper
          sx={{
            borderRadius: 5,
            p: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            My Profile
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 4,
            }}
          >
            <Tab label="Profile" />

            <Tab label="Security" />
          </Tabs>

          {/* PROFILE TAB */}

          {tab === 0 && (
            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",

                  md: "1fr 1fr",
                },

                gap: 3,
              }}
            >
              <TextField
                fullWidth
                label="Full Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,

                    name: e.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,

                    email: e.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,

                    phone: e.target.value,
                  })
                }
              />

              <TextField
                select
                fullWidth
                label="Department"
                value={profile.department}
                onChange={(e) =>
                  setProfile({
                    ...profile,

                    department: e.target.value,
                  })
                }
              >
                <MenuItem value="HR">HR</MenuItem>

                <MenuItem value="Frontend">Frontend</MenuItem>

                <MenuItem value="Backend">Backend</MenuItem>

                <MenuItem value="Development">Development</MenuItem>

                <MenuItem value="Sales">Sales</MenuItem>

                <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
              </TextField>

              <Box
                sx={{
                  gridColumn: {
                    xs: "span 1",
                    md: "span 2",
                  },
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({
                      ...profile,

                      bio: e.target.value,
                    })
                  }
                />
              </Box>

              <Box
                sx={{
                  gridColumn: {
                    xs: "span 1",
                    md: "span 2",
                  },
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.2,
                    fontWeight: 700,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    " Save Changes"
                  )}
                </Button>
              </Box>
            </Box>
          )}

          {/* SECURITY TAB */}

          {tab === 1 && (
            <Box>
              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",

                    md: "1fr 1fr",
                  },

                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,

                      currentPassword: e.target.value,
                    })
                  }
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,

                      newPassword: e.target.value,
                    })
                  }
                />
              </Box>

              <Button
                variant="contained"
                onClick={handlePasswordUpdate}
                disabled={loading}
                sx={{
                  mt: 3,
                  borderRadius: 3,
                }}
              >{loading ? (

<CircularProgress
size={22}
color="inherit"
/>

) : (
                "Update Password"
)}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
