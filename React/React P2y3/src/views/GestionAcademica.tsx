import { useEffect, useState } from "react";

type Carrera = {
  id: number;
  name: string;
};

type Curso = {
  id: number;
  name: string;
  status: string;
  user_id?: number;
  career_id?: number;
};

type Asignacion = {
  id: number;
  curso_id: number;
  curso_nombre: string;
  carrera_id: number;
  carrera_nombre: string;
};

const GestionAcademica = () => {
  const [activeTab, setActiveTab] = useState("carreras");
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [nuevaCarrera, setNuevaCarrera] = useState("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoNombre, setCursoNombre] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [careerId, setCareerId] = useState("");
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchCarreras();
    fetchCursos();
    fetchAsignaciones();
  }, []);

  const fetchCarreras = async () => {
    const res = await fetch("http://localhost:8000/careers/all");
    const data = await res.json();
    setCarreras(data);
  };

  const fetchCursos = async () => {
    const res = await fetch("http://localhost:8000/cursos/all");
    const data = await res.json();
    setCursos(data);
  };

  const fetchAsignaciones = async () => {
    const res = await fetch("http://localhost:8000/asignaciones/all");
    const data = await res.json();
    setAsignaciones(data);
  };

  const crearCarrera = async () => {
    await fetch("http://localhost:8000/careers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nuevaCarrera })
    });
    setNuevaCarrera("");
    fetchCarreras();
  };

  const eliminarCarrera = async (id: number) => {
    await fetch(`http://localhost:8000/careers/${id}`, { method: "DELETE" });
    fetchCarreras();
  };

  const crearCurso = async () => {
    await fetch("http://localhost:8000/curso/AddCurso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cursoNombre })
    });
    setCursoNombre("");
    fetchCursos();
  };

  const eliminarCurso = async (id: number) => {
    await fetch(`http://localhost:8000/curso/delete/${id}`, { method: "DELETE" });
    fetchCursos();
  };

  const asignarCarreraACurso = async () => {
    await fetch("http://localhost:8000/asignaciones/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curso_id: parseInt(cursoSeleccionado), career_id: parseInt(careerId) })
    });
    fetchAsignaciones();
  };

  const eliminarAsignacion = async (id: number) => {
    await fetch(`http://localhost:8000/asignaciones/${id}`, { method: "DELETE" });
    fetchAsignaciones();
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
    marginBottom: '32px',
    color: '#111827',
    letterSpacing: '-0.02em',
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  };

  const tabButtonBase: React.CSSProperties = {
    padding: isMobile ? '10px 18px' : '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  const tabButtonActive: React.CSSProperties = {
    ...tabButtonBase,
    background: '#2563eb',
    color: 'white',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
  };

  const tabButtonInactive: React.CSSProperties = {
    ...tabButtonBase,
    background: 'white',
    color: '#4b5563',
    border: '1px solid #e5e7eb',
  };

  const contentCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#111827',
    letterSpacing: '-0.01em',
  };

  const inputStyle: React.CSSProperties = {
    padding: isMobile ? '10px 14px' : '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: isMobile ? '14px' : '15px',
    fontFamily: 'inherit',
    marginRight: '8px',
    marginBottom: isMobile ? '8px' : '0',
    minWidth: isMobile ? '100%' : '200px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    background: 'white',
  };

  const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: isMobile ? '8px' : '0',
    marginBottom: '24px',
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
    width: isMobile ? '100%' : 'auto',
  };

  const deleteButtonStyle: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    background: '#fee2e2',
    color: '#dc2626',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  };

  const listContainerStyle: React.CSSProperties = {
    maxHeight: '420px',
    overflowY: 'auto',
    marginTop: '16px',
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const listItemStyle: React.CSSProperties = {
    padding: isMobile ? '14px 0' : '16px 0',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: isMobile ? '14px' : '15px',
    color: '#374151',
    gap: '12px',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#9ca3af',
    fontSize: isMobile ? '14px' : '15px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}> Gestión Académica</h1>

      <div style={tabsContainerStyle}>
        {[
          { key: 'carreras', label: ' Materias', emoji: '📖' },
          { key: 'cursos', label: ' Cursos', emoji: '🎓' },
          { key: 'asignaciones', label: ' Asignaciones', emoji: '🔗' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? tabButtonActive : tabButtonInactive}
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "carreras" && (
        <div style={contentCardStyle}>
          <h2 style={sectionTitleStyle}> Gestión de Materias</h2>

          <div style={formContainerStyle}>
            <input
              type="text"
              placeholder="Nombre de la materia"
              style={inputStyle}
              value={nuevaCarrera}
              onChange={(e) => setNuevaCarrera(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
            <button
              style={primaryButtonStyle}
              onClick={crearCarrera}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
            >
               Crear Materia
            </button>
          </div>

          <div style={listContainerStyle}>
            <ul style={listStyle}>
              {carreras.length === 0 ? (
                <div style={emptyStateStyle}>
                   No hay materias creadas todavía
                </div>
              ) : (
                carreras.map((carrera) => (
                  <li key={carrera.id} style={listItemStyle}>
                    <span style={{ fontWeight: '500' }}>{carrera.name}</span>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => eliminarCarrera(carrera.id)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                    >
                      🗑️ Eliminar
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "cursos" && (
        <div style={contentCardStyle}>
          <h2 style={sectionTitleStyle}> Gestión de Cursos</h2>

          <div style={formContainerStyle}>
            <input
              type="text"
              placeholder="Curso (ej: 1° Año, 2° Año)"
              style={inputStyle}
              value={cursoNombre}
              onChange={(e) => setCursoNombre(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
            <button
              style={primaryButtonStyle}
              onClick={crearCurso}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
            >
               Crear Curso
            </button>
          </div>

          <div style={listContainerStyle}>
            <ul style={listStyle}>
              {cursos.length === 0 ? (
                <div style={emptyStateStyle}>
                   No hay cursos creados todavía
                </div>
              ) : (
                cursos.map((curso) => (
                  <li key={curso.id} style={listItemStyle}>
                    <span style={{ fontWeight: '500' }}>{curso.name}</span>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => eliminarCurso(curso.id)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                    >
                      🗑️ Eliminar
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "asignaciones" && (
        <div style={contentCardStyle}>
          <h2 style={sectionTitleStyle}> Asignar Materias a Cursos</h2>

          <div style={formContainerStyle}>
            <select
              style={selectStyle}
              value={cursoSeleccionado}
              onChange={(e) => setCursoSeleccionado(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            >
              <option value="">Seleccionar curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>{curso.name}</option>
              ))}
            </select>
            <select
              style={selectStyle}
              value={careerId}
              onChange={(e) => setCareerId(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            >
              <option value="">Seleccionar materia</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button
              style={primaryButtonStyle}
              onClick={asignarCarreraACurso}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
            >
               Asignar
            </button>
          </div>

          <div style={listContainerStyle}>
            <ul style={listStyle}>
              {asignaciones.length === 0 ? (
                <div style={emptyStateStyle}>
                   No hay asignaciones creadas todavía
                </div>
              ) : (
                asignaciones.map((a) => (
                  <li key={a.id} style={listItemStyle}>
                    <span style={{ fontWeight: '500' }}>
                      Curso: {a.curso_nombre} <span style={{ color: '#6b7280', fontWeight: '400' }}>→</span> Materia: {a.carrera_nombre}
                    </span>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => eliminarAsignacion(a.id)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                    >
                      🗑️ Eliminar
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAcademica;
