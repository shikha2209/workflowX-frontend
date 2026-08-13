// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate
// } from "react-router-dom";

// import Login from "../pages/auth/Login";
// import Signup from "../pages/auth/Signup";
// import Dashboard from "../pages/dashboard/Dashboard";
// import Tasks from "../pages/tasks/Tasks";
// import Kanban from "../pages/kanban/Kanban";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route
//           path="/"
//           element={<Navigate to="/login" />}
//         />

//         <Route
//           path="/login"
//           element={<Login />}
//         />

//         <Route
//           path="/signup"
//           element={<Signup />}
//         />

//         <Route
//  path="/dashboard"
//  element={<Dashboard/>}
// />

// <Route
//   path="/tasks"
//   element={<Tasks/>}
// />

// <Route
// path="/kanban"
// element={<Kanban/>}
// />
//       </Routes>
//     </BrowserRouter>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "../context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";
import Tasks from "../pages/tasks/Tasks";
import Kanban from "../pages/kanban/Kanban";
import Users from "../pages/users/Users";
import AccountSettings from "../pages/AccountSettings";

export default function AppRoutes() {
  return (
    // AuthProvider wraps the entire router so every page can call useAuth()
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public routes (no login needed) ──────────────────────── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Admin only ───────────────────────────────────────────── */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          {/* ── User only ────────────────────────────────────────────── */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Shared (both roles, Kanban gates features internally) ── */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kanban"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Kanban />
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ─────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
<Route
path="/profile"
element={<AccountSettings />}
/>
         
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
