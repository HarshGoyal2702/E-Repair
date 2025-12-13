import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export default function AdminRoute({ children }) {
  const { token, admin } = useSelector((state) => state.admin);
  console.log("ADMIN STATE:", admin, token);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (admin?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
