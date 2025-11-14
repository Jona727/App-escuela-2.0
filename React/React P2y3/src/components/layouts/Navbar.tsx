import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";

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

  // Estilos
  const navStyle: React.CSSProperties = {
    background: '#ffffff',
    padding: isMobile ? '16px 20px' : '16px 40px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e9edef',
    gap: isMobile ? '16px' : '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const logoIconStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: '#25D366',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    color: '#111b21',
    margin: 0,
  };

  const linksContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? '12px' : '32px',
  };

  const userSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    alignSelf: isMobile ? 'flex-start' : 'center',
  };

  const avatarStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#25D366',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
  };

  const userInfoStyle: React.CSSProperties = {
    display: isMobile ? 'none' : 'block',
  };

  const userNameStyle: React.CSSProperties = {
    margin: 0,
    fontWeight: '500',
    fontSize: '14px',
    color: '#111b21',
  };

  const userTypeStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '12px',
    color: '#667781',
  };

  const logoutButtonStyle: React.CSSProperties = {
    background: '#ffffff',
    color: '#dc2626',
    border: '1px solid #e5e7eb',
    padding: isMobile ? '8px 12px' : '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'inherit',
  };

  // CSS para la animación de la línea verde
  const styleSheet = `
    @keyframes slideIn {
      from {
        width: 0;
      }
      to {
        width: 100%;
      }
    }

    .nav-link {
      position: relative;
      text-decoration: none;
      color: #54656f;
      font-weight: 500;
      font-size: 15px;
      padding: 8px 0;
      transition: color 0.2s ease;
      display: inline-block;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 3px;
      background-color: #25D366;
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: #25D366;
    }

    .nav-link:hover::after {
      width: 100%;
      animation: slideIn 0.3s ease forwards;
    }

    .nav-link.active {
      color: #111b21;
      font-weight: 600;
    }

    .nav-link.active::after {
      width: 100%;
      background-color: #25D366;
    }
  `;

  return (
    <>
      <style>{styleSheet}</style>
      <nav style={navStyle}>
        {/* Logo */}
        <div style={logoContainerStyle}>
          <div style={logoIconStyle}>
            <GraduationCap color="white" size={24} strokeWidth={2.5} />
          </div>
          <h1 style={logoTextStyle}>Instituto Mariano Moreno</h1>
        </div>

        {/* Links de navegación */}
        <div style={linksContainerStyle}>
          {userType?.toLowerCase() === "alumno" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </NavLink>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Perfil
          </NavLink>

          {userType?.toLowerCase() === "alumno" && (
            <>
              <NavLink
                to="/MiCursada"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Mi Cursada
              </NavLink>
              <NavLink
                to="/MisPagos"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Mis Pagos
              </NavLink>
            </>
          )}

          {userType?.toLowerCase() === "administrador" && (
            <>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/user"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Usuarios
              </NavLink>
              <NavLink
                to="/GestionAcademica"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Gestión
              </NavLink>
              <NavLink
                to="/pagos"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Pagos
              </NavLink>
              <NavLink
                to="/inscripciones"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Inscripciones
              </NavLink>
            </>
          )}
        </div>

        {/* Sección de usuario */}
        <div style={userSectionStyle}>
          <div style={avatarStyle}>
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={userInfoStyle}>
            <p style={userNameStyle}>{userName}</p>
            <p style={userTypeStyle}>{userType}</p>
          </div>
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <LogOut size={16} />
            {!isMobile && 'Salir'}
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
