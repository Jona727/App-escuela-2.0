import { useEffect, useRef, useState } from "react";
import { UserPlus, Users as UsersIcon, X } from "lucide-react";

type Usuario = {
  id: number;
  username: string;
  email: string;
  dni: string;
  firstname: string;
  lastname: string;
  type: string;
  curso?: string;
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

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);

  // Estados para paginación
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const tableBodyRef = useRef<HTMLDivElement>(null);

  // Estados para búsqueda
  const [searchType, setSearchType] = useState<"dni" | "curso">("dni");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsuarios = async (lastSeenId?: number, resetList = false) => {
    if (isLoadingUsers) return;

    setIsLoadingUsers(true);
    try {
      let res;

      // Si hay búsqueda activa, usar endpoint filtrado
      if (searchValue.trim()) {
        const body: any = {
          limit: 10,
          last_seen_id: lastSeenId || null,
        };

        if (searchType === "dni") {
          body.dni = parseInt(searchValue) || 0;
        } else if (searchType === "curso") {
          body.curso = searchValue;
        }

        res = await fetch("http://localhost:8000/users/paginated/filtered-async", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        // Sin búsqueda, usar endpoint normal
        const url = lastSeenId
          ? `http://localhost:8000/users/all?limit=10&last_seen_id=${lastSeenId}`
          : `http://localhost:8000/users/all?limit=10`;

        res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

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
    setMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Preparar datos según si es edición o creación
    const nuevo: any = {
      username: userRef.current?.value,
      email: emailRef.current?.value,
      dni: parseInt(dniRef.current?.value || "0"),
      firstname: firstNameRef.current?.value,
      lastname: lastNameRef.current?.value,
      type: type,
    };

    // Solo incluir password si NO estamos en modo edición
    if (!modoEdicion) {
      nuevo.password = passRef.current?.value;
    }

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
      setMsg(modoEdicion ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
      fetchUsuarios(undefined, true);
      limpiar();
      setTimeout(() => setShowCreateModal(false), 1500);
    } else {
      setMsg(data.message || "Error al guardar usuario");
    }
  };

  const handleEditar = (u: Usuario) => {
    setModoEdicion(u);
    setType(u.type);
    setShowUsersModal(false);
    setShowCreateModal(true);

    // Usar setTimeout para asegurar que el modal se renderice antes de llenar los campos
    setTimeout(() => {
      if (userRef.current) userRef.current.value = u.username;
      if (emailRef.current) emailRef.current.value = u.email;
      if (dniRef.current) dniRef.current.value = u.dni;
      if (firstNameRef.current) firstNameRef.current.value = u.firstname;
      if (lastNameRef.current) lastNameRef.current.value = u.lastname;
    }, 0);
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
      setTimeout(() => setMsg(""), 3000);
    } else {
      setMsg(data.message || "Error al eliminar");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const openCreateModal = () => {
    limpiar();
    setShowCreateModal(true);
  };

  const openUsersModal = () => {
    fetchUsuarios(undefined, true);
    setShowUsersModal(true);
  };

  // Estilos compactos y profesionales
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

  const accessGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '20px',
  };

  const accessCardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const iconContainerStyle = (color: string): React.CSSProperties => ({
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  });

  const accessTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  };

  const accessDescStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
  };

  // Estilos de modal
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
    border: '1px solid #e5e7eb',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s',
  };

  const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    fontWeight: '500',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#6b7280',
    marginLeft: '12px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    background: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#4b5563',
    borderBottom: '1px solid #f3f4f6',
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    marginRight: '8px',
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

  const alertStyle = (isError: boolean): React.CSSProperties => ({
    marginTop: '16px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    background: isError ? '#fef2f2' : '#f0fdf4',
    color: isError ? '#991b1b' : '#166534',
    border: `1px solid ${isError ? '#fca5a5' : '#86efac'}`,
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Gestión de Usuarios</h1>
        <p style={subtitleStyle}>
          Administra los usuarios del sistema
        </p>
      </div>

      {/* Acceso Rápido */}
      <div style={accessGridStyle}>
        {/* Crear Usuario */}
        <div
          style={accessCardStyle}
          onClick={openCreateModal}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle('#dcfce7')}>
            <UserPlus size={28} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={accessTitleStyle}>Crear Usuario</h3>
            <p style={accessDescStyle}>Registrar nuevo alumno o administrador</p>
          </div>
        </div>

        {/* Ver Usuarios */}
        <div
          style={accessCardStyle}
          onClick={openUsersModal}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle('#dbeafe')}>
            <UsersIcon size={28} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 style={accessTitleStyle}>Usuarios Registrados</h3>
            <p style={accessDescStyle}>Ver, editar y eliminar usuarios</p>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar Usuario */}
      {showCreateModal && (
        <div style={overlayStyle} onClick={() => { setShowCreateModal(false); limpiar(); }}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>
                {modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button
                onClick={() => { setShowCreateModal(false); limpiar(); }}
                style={closeButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                <div>
                  <label style={labelStyle}>Usuario</label>
                  <input
                    ref={userRef}
                    style={inputStyle}
                    placeholder="Nombre de usuario"
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>

                {!modoEdicion && (
                  <div>
                    <label style={labelStyle}>Contraseña</label>
                    <input
                      type="password"
                      ref={passRef}
                      style={inputStyle}
                      placeholder="Contraseña"
                      required
                      onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    ref={emailRef}
                    style={inputStyle}
                    placeholder="correo@ejemplo.com"
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={labelStyle}>DNI</label>
                  <input
                    type="number"
                    ref={dniRef}
                    style={inputStyle}
                    placeholder="12345678"
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nombre</label>
                  <input
                    ref={firstNameRef}
                    style={inputStyle}
                    placeholder="Nombre"
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Apellido</label>
                  <input
                    ref={lastNameRef}
                    style={inputStyle}
                    placeholder="Apellido"
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Tipo de Usuario</label>
                <select
                  style={{...inputStyle, cursor: 'pointer'}}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                >
                  <option value="Alumno">Alumno</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
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
                <div style={alertStyle(msg.toLowerCase().includes("error"))}>
                  {msg}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal Usuarios Registrados */}
      {showUsersModal && (
        <div style={overlayStyle} onClick={() => setShowUsersModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>
                Usuarios Registrados ({usuarios.length})
              </h2>
              <button
                onClick={() => setShowUsersModal(false)}
                style={closeButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div style={{
              marginBottom: '20px',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <div style={{ flex: isMobile ? '1 1 100%' : '0 0 150px' }}>
                  <label style={labelStyle}>Buscar por</label>
                  <select
                    style={{...inputStyle, cursor: 'pointer'}}
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as "dni" | "curso")}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  >
                    <option value="dni">DNI</option>
                    <option value="curso">Curso</option>
                  </select>
                </div>

                <div style={{ flex: isMobile ? '1 1 100%' : '1' }}>
                  <label style={labelStyle}>
                    {searchType === "dni" ? "Número de DNI" : "Nombre del curso"}
                  </label>
                  <input
                    type={searchType === "dni" ? "number" : "text"}
                    style={inputStyle}
                    placeholder={searchType === "dni" ? "Ej: 12345678" : "Ej: 1er Año"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        fetchUsuarios(undefined, true);
                      }
                    }}
                  />
                </div>

                <div style={{
                  flex: isMobile ? '1 1 100%' : '0 0 auto',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => fetchUsuarios(undefined, true)}
                    style={{
                      ...buttonStyle,
                      background: '#3b82f6',
                      padding: '10px 24px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                  >
                    Buscar
                  </button>

                  {searchValue && (
                    <button
                      onClick={() => {
                        setSearchValue("");
                        setTimeout(() => fetchUsuarios(undefined, true), 0);
                      }}
                      style={{
                        ...buttonStyle,
                        background: '#6b7280',
                        padding: '10px 20px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#52525b'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'auto' }}
              onScroll={handleScroll}
              ref={tableBodyRef}
            >
              {usuarios.length === 0 && !isLoadingUsers ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No hay usuarios registrados
                </div>
              ) : (
                <table style={tableStyle}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr>
                      <th style={thStyle}>Usuario</th>
                      <th style={thStyle}>DNI</th>
                      <th style={thStyle}>Nombre</th>
                      <th style={thStyle}>Curso</th>
                      <th style={thStyle}>Tipo</th>
                      <th style={thStyle}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td style={tdStyle}>{u.username}</td>
                        <td style={tdStyle}>{u.dni}</td>
                        <td style={tdStyle}>{u.firstname} {u.lastname}</td>
                        <td style={tdStyle}>
                          {u.curso ? (
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              background: '#e0f2fe',
                              color: '#0369a1'
                            }}>
                              {u.curso}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '13px' }}>Sin curso</span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <span style={badgeStyle(u.type)}>{u.type}</span>
                        </td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => handleEditar(u)}
                            style={{...actionButtonStyle, background: '#dbeafe', color: '#2563eb'}}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#dbeafe'}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(u.id)}
                            style={{...actionButtonStyle, background: '#fee2e2', color: '#dc2626', marginRight: 0}}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {isLoadingUsers && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Cargando más usuarios...
                </div>
              )}

              {!isLoadingUsers && !nextCursor && usuarios.length > 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px' }}>
                  Todos los usuarios han sido cargados
                </div>
              )}
            </div>

            {msg && (
              <div style={{...alertStyle(msg.toLowerCase().includes("error")), marginTop: '16px'}}>
                {msg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
