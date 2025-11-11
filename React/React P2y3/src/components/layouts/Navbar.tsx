import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.firstName || "Usuario";
  const userType = user?.type || "Alumno";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const baseLinkStyle = {
    textDecoration: "none",
    color: "#333",
    fontWeight: "normal",
    fontSize: "14px",
    padding: "4px 8px",
    transition: "all 0.2s ease",
    display: "inline-block",
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    ...baseLinkStyle,
    color: isActive ? "#4f46e5" : "#333",
    fontWeight: isActive ? "bold" : "normal",
  });

  const hoverEffect: React.CSSProperties = {
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  const hoverScale: React.CSSProperties = {
    ...hoverEffect,
    transform: "scale(1.1)",
  };

  return (
    <nav
      style={{
        background: "linear-gradient(to right, #f8fafc, #f1f5ff)",
        padding: "12px 24px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0",
        gap: isMobile ? "12px" : "0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Logo e ícono */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(to right, #7c3aed, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap color="white" size={20} />
        </div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            background: "linear-gradient(to right, #7c3aed, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Instituto Mariano Moreno
        </h1>
      </div>

      {/* Links */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? "8px" : "1.5rem",
        }}
      >
        <NavLink to="/dashboard" style={linkStyle}>
          {({ isActive }) => (
            <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
              Dashboard
            </span>
          )}
        </NavLink>
        <NavLink to="/profile" style={linkStyle}>
          {({ isActive }) => (
            <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
              Perfil
            </span>
          )}
        </NavLink>

        {userType === "Alumno" && (
          <>
            <NavLink to="/MiCursada" style={linkStyle}>
              {({ isActive }) => (
                <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                  Mi Cursada
                </span>
              )}
            </NavLink>
            <NavLink to="/MisPagos" style={linkStyle}>
              {({ isActive }) => (
                <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                  Mis Pagos
                </span>
              )}
            </NavLink>
          </>
        )}

        {userType === "Administrador" && (
          <>
            <NavLink to="/user" style={linkStyle}>
              {({ isActive }) => (
                <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                  Usuarios
                </span>
              )}
            </NavLink>
            <NavLink to="/GestionAcademica" style={linkStyle}>
              {({ isActive }) => (
                <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                  Gestión Académica
                </span>
              )}
            </NavLink>
            <NavLink to="/pagos" style={linkStyle}>
              {({ isActive }) => (
                <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                  Pagos
                </span>
              )}
            </NavLink>
            <NavLink to="/inscripciones" style={linkStyle}>
              {({ isActive }) => (
                <span style={{ ...linkStyle({ isActive }), ...hoverEffect }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                  Inscripciones
                </span>
              )}
            </NavLink>
          </>
        )}
      </div>

      {/* Perfil usuario */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          alignSelf: isMobile ? "flex-start" : "center",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #7c3aed, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {userName?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>{userName}</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{userType}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#e11d48",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            marginLeft: "10px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
