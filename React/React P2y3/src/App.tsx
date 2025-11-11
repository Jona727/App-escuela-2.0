import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PublicRoutes from "./components/routes/PublicRoutes";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import AdminRoutes from "./components/routes/AdminRoutes";
import StudentRoutes from "./components/routes/StudentRoutes";
import MainLayout from "./components/layouts/MainLayouts";
import { lazy } from "react";

function App() {

 const Dashboard = lazy(() => import("./views/Dashboard"));
  const Inscripciones = lazy(() => import("./views/Inscripciones"));
  const GestionAcademica = lazy(() => import("./views/GestionAcademica"));
  const Pagos = lazy(() => import("./views/Pagos"));
  const User = lazy(() => import("./views/User"));
  const Profile = lazy(() => import("./views/Profile"));
  const MiCursada = lazy(() => import("./views/MiCursada"));
  const MisPagos = lazy(() => import("./views/MisPagos"));

  return (
    <BrowserRouter>
      <Routes>

        {/* Sólo Login público */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>

            {/* Rutas comunes para admin y usuario */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* Rutas sólo para ADMIN */}
            <Route element={<AdminRoutes />}>
              <Route path="/GestionAcademica" element={<GestionAcademica />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/user" element={<User />} />
              <Route path="/inscripciones" element={<Inscripciones />} />
            </Route>

            {/* Rutas sólo para ALUMNOS */}
            <Route element={<StudentRoutes />}>
              <Route path="/MiCursada" element={<MiCursada />} />
              <Route path="/MisPagos" element={<MisPagos />} />
            </Route>

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
