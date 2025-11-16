import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Link as LinkIcon, X } from "lucide-react";

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
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [nuevaCarrera, setNuevaCarrera] = useState("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoNombre, setCursoNombre] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [careerId, setCareerId] = useState("");
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Estados para modales
  const [showMateriasModal, setShowMateriasModal] = useState(false);
  const [showCursosModal, setShowCursosModal] = useState(false);
  const [showAsignacionesModal, setShowAsignacionesModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    if (!nuevaCarrera.trim()) return;
    const confirmacion = confirm(`¿Crear la materia "${nuevaCarrera}"?`);
    if (!confirmacion) return;

    await fetch("http://localhost:8000/careers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nuevaCarrera })
    });
    setNuevaCarrera("");
    fetchCarreras();
  };

  const eliminarCarrera = async (id: number, name: string) => {
    const confirmacion = confirm(`¿Estás seguro que deseas eliminar la materia "${name}"?`);
    if (!confirmacion) return;

    await fetch(`http://localhost:8000/careers/${id}`, { method: "DELETE" });
    fetchCarreras();
  };

  const crearCurso = async () => {
    if (!cursoNombre.trim()) return;
    const confirmacion = confirm(`¿Crear el curso "${cursoNombre}"?`);
    if (!confirmacion) return;

    await fetch("http://localhost:8000/curso/AddCurso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cursoNombre })
    });
    setCursoNombre("");
    fetchCursos();
  };

  const eliminarCurso = async (id: number, name: string) => {
    const confirmacion = confirm(`¿Estás seguro que deseas eliminar el curso "${name}"?`);
    if (!confirmacion) return;

    await fetch(`http://localhost:8000/curso/delete/${id}`, { method: "DELETE" });
    fetchCursos();
  };

  const asignarCarreraACurso = async () => {
    if (!cursoSeleccionado || !careerId) {
      alert("Por favor selecciona un curso y una materia");
      return;
    }

    // Verificar si la materia ya está asignada al curso
    const yaAsignada = asignaciones.some(
      (a) => a.curso_id === parseInt(cursoSeleccionado) && a.carrera_id === parseInt(careerId)
    );

    if (yaAsignada) {
      const nombreCurso = cursos.find(c => c.id === parseInt(cursoSeleccionado))?.name;
      const nombreMateria = carreras.find(c => c.id === parseInt(careerId))?.name;
      alert(`La materia "${nombreMateria}" ya está asignada al curso "${nombreCurso}". No se pueden duplicar asignaciones.`);
      return;
    }

    await fetch("http://localhost:8000/asignaciones/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curso_id: parseInt(cursoSeleccionado), career_id: parseInt(careerId) })
    });
    setCursoSeleccionado("");
    setCareerId("");
    fetchAsignaciones();
  };

  const eliminarAsignacion = async (id: number) => {
    const confirmacion = confirm("¿Estás seguro que deseas eliminar esta asignación?");
    if (!confirmacion) return;

    await fetch(`http://localhost:8000/asignaciones/${id}`, { method: "DELETE" });
    fetchAsignaciones();
  };

  // Función para agrupar asignaciones por curso
  const agruparPorCurso = () => {
    const grupos: { [key: number]: { nombre: string; materias: { id: number; nombre: string; asignacionId: number }[] } } = {};

    asignaciones.forEach((a) => {
      if (!grupos[a.curso_id]) {
        grupos[a.curso_id] = {
          nombre: a.curso_nombre,
          materias: []
        };
      }
      grupos[a.curso_id].materias.push({
        id: a.carrera_id,
        nombre: a.carrera_nombre,
        asignacionId: a.id
      });
    });

    return Object.entries(grupos).map(([cursoId, data]) => ({
      cursoId: parseInt(cursoId),
      cursoNombre: data.nombre,
      materias: data.materias
    }));
  };

  const openMateriasModal = () => {
    fetchCarreras();
    setShowMateriasModal(true);
  };

  const openCursosModal = () => {
    fetchCursos();
    setShowCursosModal(true);
  };

  const openAsignacionesModal = () => {
    fetchCarreras();
    fetchCursos();
    fetchAsignaciones();
    setShowAsignacionesModal(true);
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
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
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
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
  };

  const iconContainerStyle = (color: string): React.CSSProperties => ({
    width: '64px',
    height: '64px',
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
    maxWidth: '700px',
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

  const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexDirection: isMobile ? 'column' : 'row',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
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
    whiteSpace: 'nowrap',
  };

  const listContainerStyle: React.CSSProperties = {
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const listItemStyle: React.CSSProperties = {
    padding: '16px 0',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#374151',
    gap: '12px',
  };

  const deleteButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    background: '#fee2e2',
    color: '#dc2626',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#9ca3af',
    fontSize: '14px',
  };

  const cursoCardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    background: '#fafafa',
  };

  const cursoHeaderStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #3b82f6',
  };

  const materiaItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    marginBottom: '8px',
    background: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

  const materiaBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    background: '#dcfce7',
    color: '#166534',
    flex: 1,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Gestión Académica</h1>
        <p style={subtitleStyle}>
          Administra materias, cursos y sus asignaciones
        </p>
      </div>

      {/* Acceso Rápido */}
      <div style={accessGridStyle}>
        {/* Materias */}
        <div
          style={accessCardStyle}
          onClick={openMateriasModal}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle('#fef3c7')}>
            <BookOpen size={32} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h3 style={accessTitleStyle}>Materias</h3>
            <p style={accessDescStyle}>Crear y gestionar materias</p>
          </div>
        </div>

        {/* Cursos */}
        <div
          style={accessCardStyle}
          onClick={openCursosModal}
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
            <GraduationCap size={32} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={accessTitleStyle}>Cursos</h3>
            <p style={accessDescStyle}>Crear y gestionar cursos</p>
          </div>
        </div>

        {/* Asignaciones */}
        <div
          style={accessCardStyle}
          onClick={openAsignacionesModal}
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
            <LinkIcon size={32} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 style={accessTitleStyle}>Asignaciones</h3>
            <p style={accessDescStyle}>Asignar materias a cursos</p>
          </div>
        </div>
      </div>

      {/* Modal Materias */}
      {showMateriasModal && (
        <div style={overlayStyle} onClick={() => setShowMateriasModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Gestión de Materias</h2>
              <button
                onClick={() => setShowMateriasModal(false)}
                style={closeButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <div style={formContainerStyle}>
              <input
                type="text"
                placeholder="Nombre de la materia"
                style={inputStyle}
                value={nuevaCarrera}
                onChange={(e) => setNuevaCarrera(e.target.value)}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                onKeyPress={(e) => e.key === 'Enter' && crearCarrera()}
              />
              <button
                style={buttonStyle}
                onClick={crearCarrera}
                onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
              >
                Crear
              </button>
            </div>

            <div style={listContainerStyle}>
              {carreras.length === 0 ? (
                <div style={emptyStateStyle}>
                  No hay materias creadas todavía
                </div>
              ) : (
                carreras.map((carrera) => (
                  <div key={carrera.id} style={listItemStyle}>
                    <span style={{ fontWeight: '500' }}>{carrera.name}</span>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => eliminarCarrera(carrera.id, carrera.name)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Cursos */}
      {showCursosModal && (
        <div style={overlayStyle} onClick={() => setShowCursosModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Gestión de Cursos</h2>
              <button
                onClick={() => setShowCursosModal(false)}
                style={closeButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <div style={formContainerStyle}>
              <input
                type="text"
                placeholder="Nombre del curso (ej: 1° Año, 2° Año)"
                style={inputStyle}
                value={cursoNombre}
                onChange={(e) => setCursoNombre(e.target.value)}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                onKeyPress={(e) => e.key === 'Enter' && crearCurso()}
              />
              <button
                style={buttonStyle}
                onClick={crearCurso}
                onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
              >
                Crear
              </button>
            </div>

            <div style={listContainerStyle}>
              {cursos.length === 0 ? (
                <div style={emptyStateStyle}>
                  No hay cursos creados todavía
                </div>
              ) : (
                cursos.map((curso) => (
                  <div key={curso.id} style={listItemStyle}>
                    <span style={{ fontWeight: '500' }}>{curso.name}</span>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => eliminarCurso(curso.id, curso.name)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Asignaciones */}
      {showAsignacionesModal && (
        <div style={overlayStyle} onClick={() => setShowAsignacionesModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Asignar Materias a Cursos</h2>
              <button
                onClick={() => setShowAsignacionesModal(false)}
                style={closeButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <div style={formContainerStyle}>
              <select
                style={{...inputStyle, cursor: 'pointer'}}
                value={cursoSeleccionado}
                onChange={(e) => setCursoSeleccionado(e.target.value)}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>{curso.name}</option>
                ))}
              </select>

              <select
                style={{...inputStyle, cursor: 'pointer'}}
                value={careerId}
                onChange={(e) => setCareerId(e.target.value)}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar materia</option>
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button
                style={buttonStyle}
                onClick={asignarCarreraACurso}
                onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
              >
                Asignar
              </button>
            </div>

            <div style={listContainerStyle}>
              {asignaciones.length === 0 ? (
                <div style={emptyStateStyle}>
                  No hay asignaciones creadas todavía
                </div>
              ) : (
                agruparPorCurso().map((curso) => (
                  <div key={curso.cursoId} style={cursoCardStyle}>
                    <h3 style={cursoHeaderStyle}>{curso.cursoNombre}</h3>
                    {curso.materias.length === 0 ? (
                      <div style={{ ...emptyStateStyle, padding: '20px' }}>
                        No hay materias asignadas a este curso
                      </div>
                    ) : (
                      <div>
                        {curso.materias.map((materia) => (
                          <div
                            key={materia.asignacionId}
                            style={materiaItemStyle}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                          >
                            <span style={materiaBadgeStyle}>{materia.nombre}</span>
                            <button
                              style={{...deleteButtonStyle, marginLeft: '12px'}}
                              onClick={() => eliminarAsignacion(materia.asignacionId)}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAcademica;
