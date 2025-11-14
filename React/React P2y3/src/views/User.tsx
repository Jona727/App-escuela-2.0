import { useEffect, useRef, useState } from "react";

type Usuario = {
  id: number;
  username: string;
  email: string;
  dni: string;
  firstname: string;
  lastname: string;
  type: string;
};

function User() {
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dniRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState("Alumno");
  const [msg, setMsg] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modoEdicion, setModoEdicion] = useState<Usuario | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Estados para paginación
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const tableBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUsuarios(undefined, true);
  }, []);

  const fetchUsuarios = async (lastSeenId?: number, resetList = false) => {
    if (isLoadingUsers) return;

    setIsLoadingUsers(true);
    try {
      const url = lastSeenId
        ? `http://localhost:8000/users/all?limit=10&last_seen_id=${lastSeenId}`
        : `http://localhost:8000/users/all?limit=10`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        console.error("Error al cargar usuarios:", res.statusText);
        if (resetList) setUsuarios([]);
        setIsLoadingUsers(false);
        return;
      }

      const data = await res.json();

      if (data.users && Array.isArray(data.users)) {
        setUsuarios((prev) => resetList ? data.users : [...prev, ...data.users]);
        setNextCursor(data.next_cursor || null);
      } else if (Array.isArray(data)) {
        setUsuarios((prev) => resetList ? data : [...prev, ...data]);
        setNextCursor(null);
      } else {
        console.error("Formato de respuesta inesperado:", data);
        if (resetList) setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      if (resetList) setUsuarios([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Función para detectar scroll y cargar más usuarios
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // Si está cerca del final (100px antes), cargar más
    if (scrollHeight - scrollTop - clientHeight < 100 && nextCursor && !isLoadingUsers) {
      fetchUsuarios(nextCursor);
    }
  };

  const limpiar = () => {
    if (firstNameRef.current) firstNameRef.current.value = "";
    if (lastNameRef.current) lastNameRef.current.value = "";
    if (dniRef.current) dniRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (userRef.current) userRef.current.value = "";
    if (passRef.current) passRef.current.value = "";

    setType("Alumno");
    setModoEdicion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevo = {
      username: userRef.current?.value,
      password: passRef.current?.value,
      email: emailRef.current?.value,
      dni: parseInt(dniRef.current?.value || "0"),
      firstname: firstNameRef.current?.value,
      lastname: lastNameRef.current?.value,
      type: type,
    };

    const url = modoEdicion
      ? `http://localhost:8000/users/profile/${modoEdicion.id}`
      : "http://localhost:8000/users/signup";

    const method = modoEdicion ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(nuevo),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Usuario guardado correctamente");
      fetchUsuarios(undefined, true);
      limpiar();
    } else {
      setMsg(data.message || "Error");
    }
  };

  const handleEditar = (u: Usuario) => {
    setModoEdicion(u);
    userRef.current!.value = u.username;
    emailRef.current!.value = u.email;
    dniRef.current!.value = u.dni;
    firstNameRef.current!.value = u.firstname;
    lastNameRef.current!.value = u.lastname;
    setType(u.type);
  };

  const handleEliminar = async (id: number) => {
    const confirmacion = confirm("¿Estás seguro que deseas eliminar este usuario?");
    if (!confirmacion) return;

    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Usuario eliminado correctamente");
      fetchUsuarios(undefined, true);
    } else {
      setMsg(data.message || "Error al eliminar");
    }
  };

  // Estilos
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f5f7fa',
    padding: isMobile ? '20px' : '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: isMobile ? '28px' : '32px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#111827',
    letterSpacing: '-0.02em',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '14px' : '16px',
    color: '#6b7280',
    marginBottom: '32px',
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #c2c8d5ff',
    marginBottom: '32px',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: isMobile ? '16px' : '20px',
    marginBottom: '20px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? '10px 14px' : '12px 16px',
    borderRadius: '8px',
    border: '1px solid #c2c8d5ff',
    fontSize: isMobile ? '14px' : '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    background: 'white',
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: isMobile ? '10px 20px' : '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '500',
    cursor: 'pointer',
    background: '#10b981',
    color: 'white',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
    flex: isMobile ? '1' : '0',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    background: '#6b7280',
    boxShadow: '0 2px 6px rgba(107, 114, 128, 0.3)',
  };

  const messageStyle = (isError: boolean): React.CSSProperties => ({
    marginTop: '16px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    background: isError ? '#fee2e2' : '#d1fae5',
    color: isError ? '#dc2626' : '#059669',
    border: `1px solid ${isError ? '#fecaca' : '#a7f3d0'}`,
  });

  const tableContainerStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #c2c8d5ff',
    maxHeight: '600px',
    overflowY: 'auto',
    overflowX: 'auto',
    position: 'relative',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const theadStyle: React.CSSProperties = {
    background: '#d2d9e5ff',
  };

  const thStyle: React.CSSProperties = {
    padding: isMobile ? '12px 16px' : '16px 20px',
    textAlign: 'left',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  };

  const tdStyle: React.CSSProperties = {
    padding: isMobile ? '12px 16px' : '16px 20px',
    fontSize: isMobile ? '13px' : '14px',
    color: '#4b5563',
    borderBottom: '1px solid #f3f4f6',
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    marginRight: '8px',
  };

  const editButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    background: '#dbeafe',
    color: '#2563eb',
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    background: '#fee2e2',
    color: '#dc2626',
    marginRight: '0',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#9ca3af',
    fontSize: isMobile ? '14px' : '15px',
  };

  const badgeStyle = (userType: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    background: userType === 'Administrador' ? '#dbeafe' : '#d1fae5',
    color: userType === 'Administrador' ? '#2563eb' : '#059669',
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <h1 style={headerStyle}>
         {modoEdicion ? "Editar Usuario" : "Gestión de Usuarios"}
      </h1>
      <p style={subtitleStyle}>
        {modoEdicion ? "Modifica los datos del usuario seleccionado" : "Crea y administra usuarios del sistema"}
      </p>

      {/* Formulario */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>
          {modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <input
              ref={userRef}
              style={inputStyle}
              placeholder=" Username"
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />

            {!modoEdicion && (
              <input
                type="password"
                ref={passRef}
                style={inputStyle}
                placeholder=" Password"
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            )}

            <input
              type="email"
              ref={emailRef}
              style={inputStyle}
              placeholder=" Email"
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />

            <input
              type="number"
              ref={dniRef}
              style={inputStyle}
              placeholder=" DNI"
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />

            <input
              ref={firstNameRef}
              style={inputStyle}
              placeholder=" Nombre"
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />

            <input
              ref={lastNameRef}
              style={inputStyle}
              placeholder=" Apellido"
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <select
              style={selectStyle}
              value={type}
              onChange={(e) => setType(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            >
              <option value="Alumno"> Alumno</option>
              <option value="Administrador"> Administrador</option>
            </select>
          </div>

          <div style={buttonGroupStyle}>
            <button
              type="submit"
              style={primaryButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
            >
              {modoEdicion ? " Guardar Cambios" : " Crear Usuario"}
            </button>

            {modoEdicion && (
              <button
                type="button"
                onClick={limpiar}
                style={secondaryButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#52525b'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
              >
                 Cancelar
              </button>
            )}
          </div>

          {msg && (
            <div style={messageStyle(msg.toLowerCase().includes("error"))}>
              {msg.toLowerCase().includes("error") ? "❌" : "✅"} {msg}
            </div>
          )}
        </form>
      </div>

      {/* Tabla de usuarios */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>
          👥 Usuarios Registrados
          {usuarios.length > 0 && (
            <span style={{ fontSize: '14px', fontWeight: '400', color: '#6b7280', marginLeft: '12px' }}>
              ({usuarios.length} {usuarios.length === 1 ? 'usuario' : 'usuarios'} cargados)
            </span>
          )}
        </h2>

        <div
          style={tableContainerStyle}
          onScroll={handleScroll}
          ref={tableBodyRef}
        >
          {usuarios.length === 0 && !isLoadingUsers ? (
            <div style={emptyStateStyle}>
              📭 No hay usuarios registrados todavía
            </div>
          ) : (
            <>
              <table style={tableStyle}>
                <thead style={theadStyle}>
                  <tr>
                    <th style={thStyle}>👤 Usuario</th>
                    <th style={thStyle}>📧 Email</th>
                    <th style={thStyle}>📝 Nombre Completo</th>
                    <th style={thStyle}>🏷️ Tipo</th>
                    <th style={thStyle}>⚙️ Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td style={tdStyle}>{u.username}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>{u.firstname} {u.lastname}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(u.type)}>{u.type}</span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleEditar(u)}
                          style={editButtonStyle}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#dbeafe'}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(u.id)}
                          style={deleteButtonStyle}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoadingUsers && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#6b7280',
                  fontSize: '14px',
                  background: '#f9fafb',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  ⏳ Cargando más usuarios...
                </div>
              )}
              {!isLoadingUsers && !nextCursor && usuarios.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  background: '#f9fafb',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  ✅ Todos los usuarios han sido cargados
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
