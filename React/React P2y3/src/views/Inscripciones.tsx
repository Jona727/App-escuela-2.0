import { useEffect, useState } from "react";
import Select from 'react-select';
import { RefreshCw } from 'lucide-react';

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

type AlumnoInscrito = {
  id: number;
  firstname: string;
  lastname: string;
  dni: string;
  alDia: boolean;
  mesesPendientes: number;
};

const Inscripciones = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Estados para modal de alumnos por curso
  const [mostrarModalCurso, setMostrarModalCurso] = useState(false);
  const [cursoSeleccionadoModal, setCursoSeleccionadoModal] = useState<Curso | null>(null);
  const [alumnosDelCurso, setAlumnosDelCurso] = useState<AlumnoInscrito[]>([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);

  // Estados para Infinite Scroll
  const [opcionesAlumnos, setOpcionesAlumnos] = useState<{ value: number; label: string }[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoadingAlumnos, setIsLoadingAlumnos] = useState(false);
  const [isRefreshingAlumnos, setIsRefreshingAlumnos] = useState(false);

  // Función para refrescar la lista completa de alumnos
  const refrescarListaAlumnos = async () => {
    setIsRefreshingAlumnos(true);
    // Limpiar el estado actual
    setOpcionesAlumnos([]);
    setNextCursor(null);

    try {
      const url = `http://localhost:8000/users/all?limit=20`;
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.users && Array.isArray(data.users)) {
        const soloAlumnos = data.users.filter((user: Alumno) =>
          user.type.toLowerCase().includes("alumno")
        );

        const newOptions = soloAlumnos.map((alumno: Alumno) => ({
          value: alumno.id,
          label: `${alumno.firstname} ${alumno.lastname} - DNI: ${alumno.dni}`,
        }));

        setOpcionesAlumnos(newOptions);
        setNextCursor(data.next_cursor || null);
      }
    } catch (error) {
      console.error("Error refrescando alumnos:", error);
    } finally {
      setIsRefreshingAlumnos(false);
    }
  };

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

  // Recargar alumnos cuando la ventana recibe foco (detecta cambios de otras vistas)
  useEffect(() => {
    const handleFocus = () => {
      refrescarListaAlumnos();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
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

  const generarMesesDelAnio = () => {
    const meses: string[] = [];
    const cicloLectivo = 2025;
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    const mesActualNumero = fechaActual.getMonth() + 1; // 1-12

    // Si estamos en el año del ciclo lectivo, generar hasta el mes actual
    // Si ya pasó el ciclo, generar todos los 12 meses
    const ultimoMes = añoActual === cicloLectivo ? mesActualNumero : 12;

    for (let mes = 1; mes <= ultimoMes; mes++) {
      const mesStr = mes.toString().padStart(2, '0');
      meses.push(`${cicloLectivo}-${mesStr}`);
    }
    return meses;
  };

  const cargarAlumnosDeCurso = async (curso: Curso) => {
    setCursoSeleccionadoModal(curso);
    setMostrarModalCurso(true);
    setLoadingAlumnos(true);

    try {
      const token = localStorage.getItem("token");

      // Obtener usuarios filtrados por curso usando el endpoint correcto
      const usersRes = await fetch("http://localhost:8000/users/paginated/filtered-async", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          limit: 100,
          curso: curso.name,
        }),
      });

      if (!usersRes.ok) {
        const errorText = await usersRes.text();
        console.error("Error en users/paginated/filtered-async:", errorText);
        throw new Error(`Error al cargar usuarios: ${usersRes.status}`);
      }

      const usersData = await usersRes.json();
      console.log("Users data:", usersData);

      // Filtrar solo alumnos (el curso ya está filtrado por el endpoint)
      const alumnosEnCurso = usersData.users?.filter(
        (u: any) => u.type && u.type.toLowerCase().includes("alumno")
      ) || [];

      console.log(`Alumnos en curso ${curso.name}:`, alumnosEnCurso);

      // Obtener todos los pagos
      const pagosRes = await fetch("http://localhost:8000/payment/paginated");

      if (!pagosRes.ok) {
        const errorText = await pagosRes.text();
        console.error("Error en payment/paginated:", errorText);
        throw new Error(`Error al cargar pagos: ${pagosRes.status}`);
      }

      const pagosData = await pagosRes.json();
      console.log("Pagos data:", pagosData);

      const mesesEsperados = generarMesesDelAnio();
      console.log("Meses esperados:", mesesEsperados);

      // Calcular estado de pagos para cada alumno
      const alumnosConEstado: AlumnoInscrito[] = alumnosEnCurso.map((alumno: any) => {
        const nombreCompleto = `${alumno.firstname} ${alumno.lastname}`;

        // Filtrar pagos de este alumno (solo del ciclo lectivo 2025)
        const pagosAlumno = pagosData.payments?.filter(
          (p: any) => p.alumno === nombreCompleto && p.mes_pagado?.startsWith('2025')
        ) || [];

        const mesesPagados = pagosAlumno.map((p: any) => p.mes_pagado.slice(0, 7));
        const mesesPendientes = mesesEsperados.filter(mes => !mesesPagados.includes(mes));

        return {
          id: alumno.id,
          firstname: alumno.firstname,
          lastname: alumno.lastname,
          dni: alumno.dni,
          alDia: mesesPendientes.length === 0,
          mesesPendientes: mesesPendientes.length,
        };
      });

      console.log("Alumnos con estado:", alumnosConEstado);
      setAlumnosDelCurso(alumnosConEstado);
    } catch (error) {
      console.error("Error detallado al cargar alumnos del curso:", error);
      alert(`Error al cargar los alumnos del curso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleInscribir = async () => {
    if (!selectedAlumno || !selectedCurso) {
      setMessage("Por favor selecciona un alumno y un curso");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      // Verificar si el alumno ya está inscrito en algún curso
      const checkRes = await fetch(`http://localhost:8000/users/paginated/filtered-async`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          limit: 1,
          last_seen_id: null,
          search: "",
        }),
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        const alumno = checkData.users?.find((u: Alumno) => u.id === parseInt(selectedAlumno));

        // Si el alumno tiene un curso, verificar que no esté inscrito
        const userDetailRes = await fetch(`http://localhost:8000/users/all?limit=1&last_seen_id=${parseInt(selectedAlumno) - 1}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userDetailRes.ok) {
          const userData = await userDetailRes.json();
          const user = userData.users?.find((u: any) => u.id === parseInt(selectedAlumno));

          if (user && user.curso) {
            const alumnoNombre = opcionesAlumnos.find(op => op.value === parseInt(selectedAlumno))?.label;
            setMessage(`Error: ${alumnoNombre || 'El alumno'} ya está inscrito en el curso "${user.curso}". Un alumno solo puede estar inscrito en un curso a la vez.`);
            setLoading(false);
            return;
          }
        }
      }

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

  const cursosListCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  };

  const cursoLinkStyle: React.CSSProperties = {
    display: 'block',
    padding: '16px 20px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '16px',
    fontWeight: '500',
    color: '#000000ff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    background: 'white',
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalContentStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  const modalHeaderStyle: React.CSSProperties = {
    padding: isMobile ? '20px' : '24px',
    borderBottom: '2px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 10,
    borderRadius: '16px 16px 0 0',
  };

  const modalBodyStyle: React.CSSProperties = {
    padding: isMobile ? '20px' : '24px',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: isMobile ? '16px' : '20px',
    right: isMobile ? '16px' : '20px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '20px',
    fontWeight: '500',
    cursor: 'pointer',
    background: '#fee2e2',
    color: '#dc2626',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const alumnoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  };

  const alumnoCardStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  };

  const alumnoBadgeStyle = (alDia: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    background: alDia ? '#d1fae5' : '#fee2e2',
    color: alDia ? '#065f46' : '#991b1b',
    marginTop: '8px',
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <p style={headerSubtitleStyle}>Asigna alumnos a cursos de manera eficiente</p>
      </div>

      {/* Formulario de inscripción */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>
           Nueva Inscripción
        </h2>

        <div style={formGridStyle}>
          <div>
<<<<<<< Updated upstream
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...labelStyle, marginBottom: '0' }}>
                 Seleccionar Alumno
              </label>
              <button
                onClick={refrescarListaAlumnos}
                disabled={isRefreshingAlumnos}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  cursor: isRefreshingAlumnos ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  opacity: isRefreshingAlumnos ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isRefreshingAlumnos) {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRefreshingAlumnos) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
                title="Refrescar lista de alumnos"
              >
                <RefreshCw
                  size={14}
                  style={{
                    animation: isRefreshingAlumnos ? 'spin 1s linear infinite' : 'none'
                  }}
                />
                {isRefreshingAlumnos ? 'Actualizando...' : 'Refrescar'}
              </button>
            </div>
=======
            <label style={labelStyle}>
              Seleccionar Alumno
            </label>
>>>>>>> Stashed changes
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

      {/* Lista de cursos */}
      <div style={cursosListCardStyle}>
        <h3 style={{ ...cardTitleStyle, marginBottom: '20px' }}>
          Cursos Disponibles
        </h3>

        {cursos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            No hay cursos disponibles
          </div>
        ) : (
          <div>
            {cursos.map((curso) => (
              <div
                key={curso.id}
                style={cursoLinkStyle}
                onClick={() => cargarAlumnosDeCurso(curso)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eff6ff';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                 {curso.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de alumnos por curso */}
      {mostrarModalCurso && cursoSeleccionadoModal && (
        <div style={modalOverlayStyle} onClick={() => setMostrarModalCurso(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            {/* Header del modal */}
            <div style={modalHeaderStyle}>
              <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Alumnos de {cursoSeleccionadoModal.name}
              </h2>
              <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#6b7280' }}>
                Estado de pagos al día de hoy
              </p>
              <button
                onClick={() => setMostrarModalCurso(false)}
                style={closeButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
              >
                ✕
              </button>
            </div>

            {/* Body del modal */}
            <div style={modalBodyStyle}>
              {loadingAlumnos ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Cargando alumnos...
                </div>
              ) : alumnosDelCurso.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No hay alumnos inscritos en este curso
                </div>
              ) : (
                <div style={alumnoGridStyle}>
                  {alumnosDelCurso.map((alumno) => (
                    <div key={alumno.id} style={alumnoCardStyle}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        {alumno.firstname} {alumno.lastname}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                        DNI: {alumno.dni}
                      </div>
                      <div style={alumnoBadgeStyle(alumno.alDia)}>
                        {alumno.alDia ? '✓ Al día' : `⚠ ${alumno.mesesPendientes} ${alumno.mesesPendientes === 1 ? 'mes' : 'meses'} pendiente${alumno.mesesPendientes === 1 ? '' : 's'}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
};

export default Inscripciones;
