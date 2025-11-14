import { Navigate, Outlet } from "react-router-dom";

function AdminRoutes() {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const role = user?.type;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role?.toLowerCase() !== "administrador") {
    return <Navigate to="/dashboard" />;  // o a donde quieras redirigir si no es admin
  }

  return <Outlet />;
}

export default AdminRoutes;
