import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Snackbar,
  Alert,
  TablePagination,
  CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUsers,
  approveUser,
  deleteUser,
  blockUser,
} from "../../services/userApi";

import type { User } from "../../types/user";

export default function Users() {

  const navigate = useNavigate();

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  const [totalUsers, setTotalUsers] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [openSnackbar, setOpenSnackbar] =
    useState(false);

  //------------------------------------------------

  const fetchUsers = async () => {

    try {

      await Promise.resolve();
      setLoading(true);

      const response =
        await getUsers(
          page + 1,
          rowsPerPage
        );

      setUsers(
        response.data.users
      );

      setTotalUsers(
        response.data.pagination.totalUsers
      );

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  };

  //------------------------------------------------
// eslint-disable-next-line react-hooks/set-state-in-effect

  useEffect(() => {

    fetchUsers();

  }, [page, rowsPerPage]);

  //------------------------------------------------

  const handleApproveUser =
    async (id: string) => {

      try {

        await approveUser(id);

        setMessage(
          "User approved successfully"
        );

        setOpenSnackbar(true);

        fetchUsers();

      }

      catch (error) {

        console.log(error);

      }

    };

  //------------------------------------------------

  const handleBlockUser =
    async (id: string) => {

      try {

        await blockUser(id);

        setMessage(
          "User blocked successfully"
        );

        setOpenSnackbar(true);

        fetchUsers();

      }

      catch (error) {

        console.log(error);

      }

    };

  //------------------------------------------------

  const handleDeleteUser =
    async (id: string) => {

      try {

        await deleteUser(id);

        setMessage(
          "User deleted successfully"
        );

        setOpenSnackbar(true);

        fetchUsers();

      }

      catch (error) {

        console.log(error);

      }

    };

  //------------------------------------------------

  return (

    <Paper
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow:
          "0 8px 25px rgba(0,0,0,0.08)",
      }}
    >

      <Box sx={{ p: 3 }}>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >

          Users Management

        </Typography>

        {

          loading ?

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 8,
              }}
            >

              <CircularProgress />

            </Box>

            :

            <TableContainer
              component={Paper}
            >

              <Table>

                <TableHead>

                  <TableRow>

                    <TableCell>Name</TableCell>

                    <TableCell>Email</TableCell>

                    <TableCell>Role</TableCell>

                    <TableCell>Status</TableCell>

                    <TableCell>Joined</TableCell>

                    <TableCell>
                      Actions
                    </TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>
                                    {users.length === 0 ? (

                    <TableRow>

                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{
                          py: 8,
                          borderBottom: "none",
                        }}
                      >

                        <Typography
                          sx={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "text.secondary",
                          }}
                        >
                          No Users Found
                        </Typography>

                      </TableCell>

                    </TableRow>

                  ) : (

                    users.map((user) => (

                      <TableRow key={user._id} hover>

                        <TableCell>
                          {user.name}
                        </TableCell>

                        <TableCell>
                          {user.email}
                        </TableCell>

                        <TableCell>

                          <Chip
                            label={user.role}
                            color={
                              user.role === "admin"
                                ? "primary"
                                : "default"
                            }
                            size="small"
                          />

                        </TableCell>

                        <TableCell>

                          {user.status === "pending" && (

                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() =>
                                handleApproveUser(
                                  user._id
                                )
                              }
                            >
                              Approve
                            </Button>

                          )}

                          {user.status === "approved" && (

                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() =>
                                handleBlockUser(
                                  user._id
                                )
                              }
                            >
                              Block
                            </Button>

                          )}

                          {user.status === "blocked" && (

                            <Chip
                              label="Blocked"
                              color="error"
                              size="small"
                            />

                          )}

                        </TableCell>

                        <TableCell>

                          {new Date(
                            user.approvedAt ||
                            user.createdAt
                          ).toLocaleDateString("en-IN")}

                        </TableCell>

                        <TableCell>

                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleDeleteUser(
                                user._id
                              )
                            }
                          >
                            Delete
                          </Button>

                        </TableCell>

                      </TableRow>

                    ))

                  )}

                </TableBody>

              </Table>

            </TableContainer>

        }

        {/* Pagination */}

        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={(_, newPage) => {

            setPage(newPage);

          }}
          onRowsPerPageChange={(event) => {

            setRowsPerPage(
              parseInt(event.target.value, 10)
            );

            setPage(0);

          }}
        />

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() =>
            setOpenSnackbar(false)
          }
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >

          <Alert
            severity="success"
            variant="filled"
          >
            {message}
          </Alert>

        </Snackbar>

      </Box>

    </Paper>

  );

}
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useEffect, useState } from "react";
// import { getUsers, deleteUser  , approveUser, blockUser} from "../../services/userApi";
// import type { User } from "../../types/user";


// export default function Users() {
//   const [users, setUsers] =
//     useState<User[]>([]);
//   ;
//   const [openSnackbar, setOpenSnackbar] =
// useState(false);

// const [message, setMessage] =
// useState("");

//   const navigate = useNavigate();

//   const fetchUsers = async () => {

//   try {

//     const response =
//       await getUsers();

//     setUsers(
//       response.data
//     );

//   } catch (error) {

//     console.log(error);

//   }

// };

// useEffect(() => {

//   let mounted = true;

//   const loadUsers = async () => {

//     try {

//       const response =
//         await getUsers();

//       if (mounted) {

//         setUsers(
//           response.data
//         );

//       }

//     } catch (error) {

//       console.log(error);

//     }

//   };

//   loadUsers();

//   return () => {

//     mounted = false;

//   };

// }, []);

//   const handleDeleteUser =
// async(id:string)=>{

// try{

// await deleteUser(id);

// setUsers(
// prev =>
// prev.filter(
// user =>
// user._id !== id
// )
// );

// }
// catch(error){

// console.log(error);

// }

// };
  
// const handleApproveUser =
// async(id:string)=>{
//   try{
// await approveUser(id);

//   setMessage(
//       "User approved successfully"
//     );

//     setOpenSnackbar(true);

// await fetchUsers();
//   }
// catch(error){

//     console.log(error);

//   }

// };

// const handleBlockUser =
// async(id:string)=>{

// await blockUser(id);

// fetchUsers();

// };



//   return (
// <Paper
//   sx={{
//     borderRadius:4,
//     overflow:"hidden",
//     boxShadow:"0 8px 25px rgba(0,0,0,0.08)"
//   }}
// >   
//     <Box sx={{ p: 3 }}>
//       <Typography
//         sx={{ variant: "h4", fontWeight: 700, mb: 3 }}
//       >
//         Users Management
//       </Typography>

//       <TableContainer
//         component={Paper}
//       >
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 Name
//               </TableCell>

//               <TableCell>
//                 Email
//               </TableCell>

//               <TableCell>
//                 Role
//               </TableCell>

//               <TableCell>
//                 Status
//               </TableCell>

//               <TableCell>
//                 Joined
//               </TableCell>
//               <TableCell>
//                Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {users.length === 0 ? ( 
//               <TableRow> 
//                 <TableCell 
//                 colSpan={6} 
//                 align="center" 
//                 sx={{ py:8, borderBottom:"none" }} > 
//                 <Box sx={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1 }} > 
//                   <Typography sx={{ fontSize:18, fontWeight:700, color:"text.secondary" }} > 
//                     No Users Found
//                      </Typography>
//                       <Typography sx={{ fontSize:14, color:"text.disabled" }} > 
//                         There are currently no users available 
//                         </Typography> 
//                         </Box> 
//                         </TableCell>
//                          </TableRow>
//                           ) : (
//             users.map(
//               (user) => (
//                 <TableRow
//                   key={user._id}
//                 >
//                   <TableCell>
//                     {user.name}
//                   </TableCell>

//                   <TableCell>
//                     {user.email}
//                   </TableCell>

//                   <TableCell>
//                     <Chip
//                       label={
//                         user.role
//                       }
//                       color={
//                         user.role ===
//                         "admin"
//                           ? "primary"
//                           : "default"
//                       }
//                     />
//                   </TableCell>

//                   <TableCell>

// {user.status === "pending" && (

// <Button
// variant="contained"
// color="success"
// onClick={()=>
// handleApproveUser(
// user._id
// )
// }
// >
// Approve
// </Button>

// )}

// {user.status === "approved" && (

// <Button
// variant="contained"
// color="warning"
// onClick={()=>
// handleBlockUser(
// user._id
// )
// }
// sx={{ml:1}}
// >
// Block
// </Button>

// )}



// </TableCell>

//                   <TableCell>
//                     {new Date(
//                       user.role === "admin"
//       ? user.createdAt
//       : user.approvedAt || user.createdAt

//                     )
//                       .toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>

// <Button
// color="error"
// variant="contained"
// sx={{ml:1}}
// onClick={()=>
// handleDeleteUser(
// user._id
// )
// }
// >
// Delete
// </Button>

// </TableCell>
//                 </TableRow>
//               )
//             )

//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//     <Box
//   sx={{
//     display: "flex",
//     alignItems: "center",
//     mb: 2,
//     gap: 1,
//   }}
// >
//   <Button
//     startIcon={<ArrowBackIcon />}
//     variant="outlined"
//     onClick={() => navigate(-1)}
//   >
//     Back
//   </Button>
// </Box>
// <Snackbar
//   open={openSnackbar}
//   autoHideDuration={1500}
//   onClose={() =>
//     setOpenSnackbar(false)
//   }
//   anchorOrigin={{
//     vertical:"top",
//     horizontal:"right"
//   }}
// >
//   <Alert
//     severity="success"
//     variant="filled"
//   >
//     {message}
//   </Alert>
// </Snackbar>
//     </Box>
//     </Paper> 
    
//   );
// }