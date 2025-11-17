import { useEffect, useState } from "react";
import { User, Lock, Camera, Mail, CreditCard, UserCheck } from "lucide-react";

type UserProfile = {
  id: number;
  user_id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  dni: number;
  type: string;
  profile_picture?: string;
};

export default function PerfilConCambioClave() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showPasswordCard, setShowPasswordCard] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.error("No se encontró usuario en localStorage");
      return;
    }

    const userParsed: UserProfile = JSON.parse(storedUser);
    const BACKEND_URL = `http://localhost:8000/users/profile/${userParsed.user_id}`;

    fetch(BACKEND_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.user);
          setProfilePicture(data.user.profile_picture || "");
        }
      })
      .catch((err) => console.error("Error al traer perfil", err));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage("Las nuevas contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("La nueva contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Contraseña cambiada correctamente");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  // Estilos minimalistas
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '24px' : '32px 40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
    letterSpacing: '-0.015em',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#6b7280',
    fontWeight: '400',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '320px 1fr',
    gap: '32px',
    alignItems: 'start',
  };

  const profileCardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #4b5563',
  };

  const avatarContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '128px',
    height: '128px',
    margin: '0 auto 24px',
  };

  const avatarImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #4b5563',
  };

  const avatarFallbackStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    fontSize: '36px',
    fontWeight: '600',
    border: '2px solid #4b5563',
  };

  const cameraButtonStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: '#6b7280',
    color: 'white',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
    border: '3px solid white',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  };

  const userHandleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    background: '#5fc683ff',
    color: '#166534',
    border: '1px solid #c2c8d5ff',
  };

  const changePasswordButtonStyle: React.CSSProperties = {
    marginTop: '8px',
    padding: '0',
    background: 'transparent',
    color: '#3b82f6',
    fontWeight: '400',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: 'inherit',
    textDecoration: 'none',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #c2c8d5ff',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '24px',
    lineHeight: '1',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s',
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    marginBottom: '24px',
    border: '1px solid #c2c8d5ff',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
  };

  const infoItemStyle: React.CSSProperties = {
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const infoLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const infoValueStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  };

  const inputGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    background: '#10b981',
    color: 'white',
    fontWeight: '500',
    borderRadius: '8px',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontSize: '15px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    opacity: isLoading ? 0.6 : 1,
    marginTop: '4px',
  };

  const alertSuccessStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '14px 16px',
    background: '#f0fdf4',
    color: '#166534',
    border: '1px solid #86efac',
    borderRadius: '8px',
    fontSize: '14px',
  };

  const alertErrorStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '14px 16px',
    background: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    fontSize: '14px',
  };

  const loadingContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
  };

  if (!user) {
    return (
      <div style={loadingContainerStyle}>
        <span>Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <p style={subtitleStyle}>Gestiona tu información personal y configuración de seguridad</p>
      </div>

      <div style={gridStyle}>
        {/* Profile Card */}
        <div style={profileCardStyle}>
          <div style={avatarContainerStyle}>
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Foto de perfil"
                style={avatarImageStyle}
              />
            ) : (
              <div style={avatarFallbackStyle}>
                {getInitials(user.firstname, user.lastname)}
              </div>
            )}
            <label
              style={cameraButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
            >
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <h2 style={userNameStyle}>
            {user.firstname} {user.lastname}
          </h2>
          <p style={userHandleStyle}>@{user.username}</p>

          <div style={badgeStyle}>
            <UserCheck size={14} />
            {user.type}
          </div>

          <button
            onClick={() => setShowPasswordCard(true)}
            style={changePasswordButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
              e.currentTarget.style.color = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
              e.currentTarget.style.color = '#3b82f6';
            }}
          >
            <Lock size={14} />
            Cambiar contraseña
          </button>
        </div>

        {/* Main Content */}
        <div>
          {/* Profile Information */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <User size={20} />
              Información Personal
            </h3>

            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <User size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={infoLabelStyle}>Nombre</p>
                  <p style={infoValueStyle}>{user.firstname}</p>
                </div>
              </div>

              <div style={infoItemStyle}>
                <User size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={infoLabelStyle}>Apellido</p>
                  <p style={infoValueStyle}>{user.lastname}</p>
                </div>
              </div>

              <div style={infoItemStyle}>
                <Mail size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={infoLabelStyle}>Email</p>
                  <p style={infoValueStyle}>{user.email}</p>
                </div>
              </div>

              <div style={infoItemStyle}>
                <CreditCard size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={infoLabelStyle}>DNI</p>
                  <p style={infoValueStyle}>{user.dni.toLocaleString('es-AR')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordCard && (
        <div
          style={overlayStyle}
          onClick={() => setShowPasswordCard(false)}
        >
          <div
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPasswordCard(false)}
              style={closeButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ×
            </button>

            <h3 style={sectionTitleStyle}>
              <Lock size={20} />
              Cambiar Contraseña
            </h3>

            <form onSubmit={handleChangePassword}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Contraseña actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Ingresa tu contraseña actual"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.outline = 'none';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>

              <div style={inputGridStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="Mínimo 6 caracteres"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#9ca3af';
                      e.currentTarget.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="Repite la nueva contraseña"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#9ca3af';
                      e.currentTarget.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.background = '#000000';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.background = '#111827';
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Cambiando...
                  </>
                ) : (
                  'Cambiar contraseña'
                )}
              </button>
            </form>

            {message && (
              <div style={message.includes('correctamente') ? alertSuccessStyle : alertErrorStyle}>
                {message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS para animación */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
