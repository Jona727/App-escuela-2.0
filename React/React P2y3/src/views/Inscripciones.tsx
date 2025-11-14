import { useEffect, useState } from "react";
import Select from 'react-select';

type Alumno = {
  id: number;
  username: string;
  email: string;
  dni: string;
  firstname: string;
  lastname: string;
  type: string;
};

type Curso = {
  id: number;
  name: string;
  status: string;
};

const Inscripciones = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Estados para Infinite Scroll
  const [opcionesAlumnos, setOpcionesAlumnos] = useState<{ value: number; label: string }[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoadingAlumnos, setIsLoadingAlumnos] = useState(false);

  // Función para cargar alumnos con paginación
  const fetchAlumnos = async (lastSeenId?: number) => {
    if (isLoadingAlumnos) return;

    setIsLoadingAlumnos(true);
    try {
      const url = lastSeenId
        ? `http://localhost:8000/users/all?limit=20&last_seen_id=${lastSeenId}`
        : `http://localhost:8000/users/all?limit=20`;

      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.users && Array.isArray(data.users)) {
        // Filtrar solo alumnos y transformar a formato react-select
        const soloAlumnos = data.users.filter((user: Alumno) =>
          user.type.toLowerCase().includes("alumno")
        );

        const newOptions = soloAlumnos.map((alumno: Alumno) => ({
          value: alumno.id,
          label: `${alumno.firstname} ${alumno.lastname} - DNI: ${alumno.dni}`,
        }));

        setOpcionesAlumnos((prev) => [...prev, ...newOptions]);
        setNextCursor(data.next_cursor || null);
      }
    } catch (error) {
      console.error("Error loading alumnos:", error);
    } finally {
      setIsLoadingAlumnos(false);
    }
  };

  // Handler para cargar más alumnos al hacer scroll
  const handleMenuScrollToBottom = () => {
    if (nextCursor && !isLoadingAlumnos) {
      fetchAlumnos(nextCursor);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Cargar primeros 20 alumnos
    fetchAlumnos();

    const cargarCursos = async () => {
      try {
        const res = await fetch("http://localhost:8000/cursos/all");
        if (res.ok) {
          const data = await res.json();
          setCursos(data);
        } else {
          console.error("Error al cargar cursos:", await res.text());
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };

    cargarCursos();
  }, []);

  const handleInscribir = async () => {
    if (!selectedAlumno || !selectedCurso) {
      setMessage("Por favor selecciona un alumno y un curso");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/user/addcurso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_user: parseInt(selectedAlumno),
          id_curso: parseInt(selectedCurso),
        }),
      });

      if (res.ok) {
        const responseText = await res.text();
        setMessage(responseText);
        setSelectedAlumno("");
        setSelectedCurso("");
      } else {
        const errorData = await res.json();
        setMessage(errorData.detail || "Error al inscribir alumno");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor");
      console.error("Error al inscribir:", error);
    } finally {
      setLoading(false);
    }
  };

  // Estilos
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f5f7fa',
    padding: isMobile ? '20px' : '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const headerContainerStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const headerTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '28px' : '32px',
    fontWeight: '600',
    color: '#111827',
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  };

  const headerSubtitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '14px' : '16px',
    color: '#6b7280',
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    marginBottom: '24px',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    marginBottom: '20px',
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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? '10px 14px' : '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: isMobile ? '14px' : '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    cursor: 'pointer',
    background: 'white',
  };

  const buttonStyle: React.CSSProperties = {
    padding: isMobile ? '12px 24px' : '12px 32px',
    borderRadius: '8px',
    border: 'none',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '500',
    cursor: loading ? 'not-allowed' : 'pointer',
    background: loading ? '#9ca3af' : '#10b981',
    color: 'white',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    boxShadow: loading ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.3)',
    width: isMobile ? '100%' : 'auto',
    opacity: loading ? 0.7 : 1,
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

  const statsCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
  };

  const statItemStyle: React.CSSProperties = {
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: '500',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '600',
    color: '#2563eb',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <h1 style={headerTitleStyle}> Inscripciones</h1>
        <p style={headerSubtitleStyle}>Asigna alumnos a cursos de manera eficiente</p>
      </div>

      {/* Formulario de inscripción */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>
           Nueva Inscripción
        </h2>

        <div style={formGridStyle}>
          <div>
            <label style={labelStyle}>
               Seleccionar Alumno
            </label>
            <Select
              options={opcionesAlumnos}
              value={opcionesAlumnos.find(op => op.value === parseInt(selectedAlumno)) || null}
              onChange={(selectedOption) => setSelectedAlumno(selectedOption ? String(selectedOption.value) : "")}
              onMenuScrollToBottom={handleMenuScrollToBottom}
              placeholder="Buscar y seleccionar alumno..."
              isClearable
              isSearchable
              isLoading={isLoadingAlumnos}
              loadingMessage={() => "Cargando más alumnos..."}
              noOptionsMessage={() => "No se encontraron alumnos"}
              styles={{
                control: (base, state) => ({
                  ...base,
                  padding: isMobile ? '2px 6px' : '4px 8px',
                  borderRadius: '8px',
                  border: state.isFocused ? '1px solid #2563eb' : '1px solid #d1d5db',
                  boxShadow: 'none',
                  fontSize: isMobile ? '14px' : '15px',
                  fontFamily: 'inherit',
                  '&:hover': {
                    borderColor: '#d1d5db',
                  }
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  marginTop: '4px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f3f4f6' : 'white',
                  color: state.isSelected ? 'white' : '#374151',
                  cursor: 'pointer',
                }),
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>
               Seleccionar Curso
            </label>
            <select
              style={selectStyle}
              value={selectedCurso}
              onChange={(e) => setSelectedCurso(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            >
              <option value="">Seleccionar curso...</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleInscribir}
          disabled={loading}
          style={buttonStyle}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#059669';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#10b981';
            }
          }}
        >
          {loading ? " Inscribiendo..." : " Inscribir Alumno"}
        </button>

        {message && (
          <div style={messageStyle(message.toLowerCase().includes("error"))}>
            {message.toLowerCase().includes("error") ? "❌" : "✅"} {message}
          </div>
        )}
      </div>

      {/* Estado de carga */}
      <div style={statsCardStyle}>
        <h3 style={{ ...cardTitleStyle, marginBottom: '16px' }}>
           Estado de Carga
        </h3>

        <div style={statsGridStyle}>
          <div style={statItemStyle}>
            <div style={statLabelStyle}> Alumnos cargados</div>
            <div style={statValueStyle}>{opcionesAlumnos.length}</div>
          </div>

          <div style={statItemStyle}>
            <div style={statLabelStyle}> Cursos disponibles</div>
            <div style={statValueStyle}>{cursos.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inscripciones;
