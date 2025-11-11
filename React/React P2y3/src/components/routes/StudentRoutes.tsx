import { Navigate, Outlet } from "react-router-dom";

const StudentRoutes = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userType = user?.type;

  return userType === "Alumno" ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default StudentRoutes;
