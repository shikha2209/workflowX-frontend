import {
  Card,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  getUsers,
  approveUser,
  blockUser,
} from "../services/userApi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function PendingApprovals() {

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  
useEffect(() => {

  let ignore = false;

  const fetchData =
    async () => {

      try {

        const response =
          await getUsers(
            1,
            1000
          );

        if (!ignore) {

          const pendingUsers =
            response.data.users.filter(
              (user: User) =>
                user.status ===
                "pending"
            );

          setUsers(
            pendingUsers
          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        if (!ignore) {

          setLoading(false);

        }

      }

    };

  fetchData();

  return () => {

    ignore = true;

  };

}, []);

  const handleApprove =
    async (id: string) => {

      try {

        await approveUser(id);

    setUsers((prev) =>
      prev.filter(
        (user) =>
          user._id !== id
      )
    );
      } catch (error) {

        console.log(error);

      }

    };

  const handleReject =
    async (id: string) => {

      try {

        await blockUser(id);

        setUsers((prev) =>
      prev.filter(
        (user) =>
          user._id !== id
      )
    );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 2,
        height: "100%",
      }}
    >

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Pending Approvals
      </Typography>

      {loading ? (

        <Typography>
          Loading...
        </Typography>

      ) : users.length === 0 ? (

        <Typography
          sx={{
            color:
              "text.secondary",
          }}
        >
          No pending approvals
        </Typography>

      ) : (

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >

          {users.map((user) => (

            <Box
              key={user._id}
              sx={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "space-between",

                gap: 2,

                p: 2,

                borderRadius: 3,

                bgcolor:
                  "background.default",
              }}
            >

              {/* Left */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >

                <Avatar
                  sx={{
                    bgcolor:
                      "#4f46e5",
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>

                <Box>

                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {user.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color:
                        "text.secondary",
                    }}
                  >
                    {user.email}
                  </Typography>

                </Box>

              </Box>

              {/* Right */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >

                <Chip
                  label={user.role}
                  size="small"
                />

                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() =>
                    handleApprove(
                      user._id
                    )
                  }
                >
                  Approve
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    handleReject(
                      user._id
                    )
                  }
                >
                  Reject
                </Button>

              </Box>

            </Box>

          ))}

        </Box>

      )}

    </Card>

  );

}