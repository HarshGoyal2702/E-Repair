import Home from "./pages/Home";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/auth/Register";
import BookRepair from "./pages/BookRepair";
import TrackStatus from "./pages/TrackStatus";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
// import Workers from "./pages/admin/Workers"; 

export const publicRoutes = [
  { path: "/", element: Home, name: "Home" },
  { path: "/services", element: Services, name: "Services" },
  { path: "/book", element: BookRepair, name: "Book Repair" },
  { path: "/track", element: TrackStatus, name: "Track Status" },
  { path: "/login", element: Login, name: "Login" },
  { path: "/register", element: Register, name: "Register" },
];

export const userRoutes = [
  { path: "/dashboard", element: UserDashboard, name: "User Dashboard" },
];

export const adminRoutes = [
  { path: "/admin/login", element: AdminLogin, name: "Admin Login" },
  {
    path: "/admin/dashboard",
    element: AdminDashboard,
    name: "Admin Dashboard",
  },

];

// Combine all routes for easy use in App.jsx
export const allRoutes = [...publicRoutes, ...userRoutes, ...adminRoutes];
