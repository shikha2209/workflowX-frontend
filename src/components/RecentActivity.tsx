import {
  Card,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  getActivities,
} from "../services/activityApi";

interface Activity {
  _id: string;
  user: string;
  action: string;
  createdAt: string;
}

export default function RecentActivity() {

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchActivities =
      async () => {

        try {

          const response =
            await getActivities();

          setActivities(
            response.data
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }

      };

    fetchActivities();

  }, []);

  const formatTime = (
    date: string
  ) => {

    const now =
      new Date().getTime();

    const activityTime =
      new Date(date).getTime();

    const diff =
      Math.floor(
        (now - activityTime)
        / 1000
      );

    if (diff < 60) {
      return `${diff} sec ago`;
    }

    if (diff < 3600) {
      return `${Math.floor(
        diff / 60
      )} mins ago`;
    }

    if (diff < 86400) {
      return `${Math.floor(
        diff / 3600
      )} hrs ago`;
    }

    return `${Math.floor(
      diff / 86400
    )} days ago`;
  };

  return (

    <Card
      sx={{
        p: 3,
        borderRadius: 4,
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
        Recent Activity
      </Typography>

      {loading ? (

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 4,
          }}
        >
          <CircularProgress
            size={28}
          />
        </Box>

      ) : activities.length === 0 ? (

        <Typography
          sx={{
            color:
              "text.secondary",
            fontSize: 14,
          }}
        >
          No recent activity
        </Typography>

      ) : (

        activities
          .slice(0, 6)
          .map((item, index) => (

          <Box
            key={item._id}
            sx={{
              mb: 2,

              borderBottom:
                index !==
                activities.length - 1
                  ? "1px solid #eee"
                  : "none",

              pb: 2,
            }}
          >

            <Typography
              sx={{
                fontSize: 14,
              }}
            >
              <strong>
                {item.user}
              </strong>{" "}

              {item.action}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color:
                  "text.secondary",
                mt: 0.5,
              }}
            >
              {formatTime(
                item.createdAt
              )}
            </Typography>

          </Box>

        ))

      )}

    </Card>

  );

}
// import {
//   Card,
//   Typography,
//   Box,
// } from "@mui/material";

// const activities = [
//   {
//     user: "John",
//     action: "assigned a task",
//     time: "2 mins ago",
//   },
//   {
//     user: "Shikha",
//     action: "created a project",
//     time: "5 mins ago",
//   },
//   {
//     user: "Alex",
//     action: "completed a task",
//     time: "10 mins ago",
//   },
// ];

// export default function RecentActivity() {
//   return (
//     <Card
//       sx={{
//         p: 3,
//         borderRadius: 4,
//         mt: 4,
//       }}
//     >
//       <Typography
//         variant="h6"
//         sx={{
//           fontWeight: 700,
//           mb: 3,
//         }}
//       >
//         Recent Activity
//       </Typography>

//       {activities.map((item, index) => (
//         <Box
//           key={index}
//           sx={{
//             mb: 2,
//             borderBottom:
//               index !== activities.length - 1
//                 ? "1px solid #eee"
//                 : "none",
//             pb: 2,
//           }}
//         >
//           <Typography>
//             <strong>{item.user}</strong>{" "}
//             {item.action}
//           </Typography>

//           <Typography
//             sx={{
//               fontSize: 13,
//               color: "gray",
//             }}
//           >
//             {item.time}
//           </Typography>
//         </Box>
//       ))}
//     </Card>
//   );
// }