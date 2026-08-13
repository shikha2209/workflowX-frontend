import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    !user?.role ||
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";

// interface Props {
//   children: React.ReactNode;
//   allowedRoles: ("admin" | "user")[];
// }

// export default function ProtectedRoute({ children, allowedRoles }: Props) {
//   const { role } = useAuth();

//   if (!role) return <Navigate to="/login" replace />;

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to={role === "admin" ? "/dashboard" : "/dashboard/user"} replace />;
//   }

//   return <>{children}</>;
// }
// import {
// Navigate
// }
// from "react-router-dom";

// import type {
// ReactNode
// }
// from "react";

// interface Props {

// children:
// ReactNode;

// allowedRoles:
// string[];

// }

// export default function ProtectedRoute({

// children,
// allowedRoles

// }:Props){

// const token =
// localStorage.getItem(
// "token"
// );

// const storedUser =
// localStorage.getItem(
// "user"
// );

// const user =

// storedUser

// ? JSON.parse(storedUser)

// : null;



// // not logged in

// if(!token){
// if (
//   !user?.role ||
//   !allowedRoles.includes(user.role)
// ) {
// return (
// <Navigate
// to={
//         user?.role === "admin"
//           ? "/dashboard/admin"
//           : "/dashboard/user"
//       }
// replace
// />
// );

// }


// // role not allowed
// if(

// !user?.role ||

// !allowedRoles.includes(
// user.role
// )

// ){

// return (
// <Navigate
// to="/login"
// replace
// />
// );

// }

// return children;

// }}