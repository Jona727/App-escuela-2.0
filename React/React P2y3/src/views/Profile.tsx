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

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)',
    padding: '32px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    margin: '0'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '16px',
    margin: '0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 2fr'
    }
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px'
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px',
    textAlign: 'center' as const
  },
  avatarContainer: {
    position: 'relative' as const,
    marginBottom: '24px'
  },
  avatar: {
    width: '128px',
    height: '128px',
    margin: '0 auto',
    position: 'relative' as const
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '4px solid white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  cameraButton: {
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
    backgroundColor: '#4f46e5',
    color: 'white',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s'
  },
  hiddenInput: {
    display: 'none'
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    margin: '0 0 8px 0'
  },
  userHandle: {
    color: '#6b7280',
    marginBottom: '16px',
    fontSize: '16px',
    margin: '0 0 16px 0'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  badgeAdmin: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fca5a5'
  },
  badgeModerator: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    border: '1px solid #93c5fd'
  },
  badgeUser: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #86efac'
  },
  badgeDefault: {
    backgroundColor: '#f9fafb',
    color: '#374151',
    border: '1px solid #d1d5db'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px'
  },
  sectionIcon: {
    marginRight: '12px',
    color: '#4f46e5'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px'
  },
  infoIcon: {
    marginRight: '12px',
    color: '#6b7280'
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 2px 0'
  },
  infoValue: {
    fontWeight: '600',
    color: '#1f2937',
    margin: '0'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px'
  },
  button: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)',
    color: 'white',
    fontWeight: '600',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  },
  alertSuccess: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
    borderRadius: '12px'
  },
  alertError: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: '12px'
  },
  alertText: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '0'
  },
  loading: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '18px',
    color: '#6b7280'
  }
};

// CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (min-width: 768px) {
    .info-grid-responsive {
      grid-template-columns: 1fr 1fr !important;
    }
    .input-grid-responsive {
      grid-template-columns: 1fr 1fr !important;
    }
    .grid-responsive {
      grid-template-columns: 1fr 2fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default function PerfilConCambioClave() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");

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
        // Aquí podrías enviar la imagen al servidor
        // uploadProfilePicture(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'admin':
        return { ...styles.badge, ...styles.badgeAdmin };
      case 'moderator':
        return { ...styles.badge, ...styles.badgeModerator };
      case 'user':
        return { ...styles.badge, ...styles.badgeUser };
      default:
        return { ...styles.badge, ...styles.badgeDefault };
    }
  };

  if (!user) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <span style={styles.loadingText}>Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Mi Perfil</h1>
          <p style={styles.subtitle}>Gestiona tu información personal y configuración de seguridad</p>
        </div>

        <div style={styles.grid} className="grid-responsive">
          {/* Profile Card */}
          <div>
            <div style={styles.profileCard}>
              <div style={styles.avatarContainer}>
                <div style={styles.avatar}>
                  {profilePicture ? (
                    <img
                      src={profilePicture}  
                      alt="Foto de perfil"
                      style={styles.avatarImage}
                    />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {getInitials(user.firstname, user.lastname)}
                    </div>
                  )}
                  <label style={styles.cameraButton}>
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={styles.hiddenInput}
                    />
                  </label>
                </div>
              </div>
              
              <h2 style={styles.userName}>
                {user.firstname} {user.lastname}
              </h2>
              <p style={styles.userHandle}>@{user.username}</p>
              
              <div>
                <span style={getBadgeStyle(user.type)}>
                  <UserCheck size={16} style={{ marginRight: '4px' }} />
                  {user.type}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Profile Information */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <User size={24} style={styles.sectionIcon} />
                <h3 style={styles.sectionTitle}>Información Personal</h3>
              </div>
              
              <div style={styles.infoGrid} className="info-grid-responsive">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={styles.infoItem}>
                    <User size={20} style={styles.infoIcon} />
                    <div style={styles.infoContent}>
                      <p style={styles.infoLabel}>Nombre</p>
                      <p style={styles.infoValue}>{user.firstname}</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoItem}>
                    <Mail size={20} style={styles.infoIcon} />
                    <div style={styles.infoContent}>
                      <p style={styles.infoLabel}>Email</p>
                      <p style={styles.infoValue}>{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={styles.infoItem}>
                    <User size={20} style={styles.infoIcon} />
                    <div style={styles.infoContent}>
                      <p style={styles.infoLabel}>Apellido</p>
                      <p style={styles.infoValue}>{user.lastname}</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoItem}>
                    <CreditCard size={20} style={styles.infoIcon} />
                    <div style={styles.infoContent}>
                      <p style={styles.infoLabel}>DNI</p>
                      <p style={styles.infoValue}>{user.dni.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <Lock size={24} style={styles.sectionIcon} />
                <h3 style={styles.sectionTitle}>Cambiar Contraseña</h3>
              </div>
              
              <div style={styles.formContainer}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div style={styles.inputGrid} className="input-grid-responsive">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={styles.input}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={styles.input}
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  style={{
                    ...styles.button,
                    ...(isLoading ? styles.buttonDisabled : {})
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={styles.spinner}></div>
                      Cambiando...
                    </>
                  ) : (
                    'Cambiar contraseña'
                  )}
                </button>
              </div>
              
              {message && (
                <div style={
                  message.includes('correctamente') 
                    ? styles.alertSuccess 
                    : styles.alertError
                }>
                  <p style={styles.alertText}>{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}