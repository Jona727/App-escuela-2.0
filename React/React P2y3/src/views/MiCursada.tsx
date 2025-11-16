import { useEffect, useState } from "react";
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Curso {
  id: number;
  nombre: string;
  anio_escolar: number;
  status: string;
}

interface Materia {
  id: number;
  nombre: string;
  estado: string;
}

interface CursadaData {
  curso: Curso;
  materias: Materia[];
}

export default function MiCursada() {
  const [cursadaData, setCursadaData] = useState<CursadaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mostrarModalMaterias, setMostrarModalMaterias] = useState(false);

  useEffect(() => {
    fetchMiCursada();
  }, []);

  const fetchMiCursada = async () => {
    try {
      if (!loading) setIsRefreshing(true);
      setError(null);

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:8000/user/mi-cursada', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido o expirado');
        }
        if (response.status === 404) {
          throw new Error('No se encontró información de cursada');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: CursadaData = await response.json();
      setCursadaData(data);
    } catch (err) {
      console.error('Error al obtener mi cursada:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la información';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'cursando':
        return <Clock size={16} style={{ color: '#3b82f6' }} />;
      case 'aprobado':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'desaprobado':
        return <XCircle size={16} style={{ color: '#ef4444' }} />;
      case 'pendiente':
        return <AlertCircle size={16} style={{ color: '#f59e0b' }} />;
      default:
        return null;
    }
  };

  // Estilos minimalistas
  const backgroundContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f5f7fa',
    width: '100%',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '60px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#1f2937',
  };

  const cursoCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    marginBottom: '64px',
  };

  const mainTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '12px',
  };

  const cursoNombreStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '32px',
    letterSpacing: '-0.025em',
    lineHeight: '1.1',
  };

  const statsLineStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0',
    alignItems: 'center',
  };

  const statStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1',
  };

  const statDividerStyle: React.CSSProperties = {
    width: '1px',
    height: '48px',
    background: '#e5e7eb',
    margin: '0 32px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const refreshButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: isRefreshing ? 'not-allowed' : 'pointer',
    color: '#6b7280',
    fontSize: '13px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    opacity: isRefreshing ? 0.5 : 1,
  };

  const materiasContainerStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  };

  const materiasListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  };

  const materiaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.15s',
  };

  const materiaNombreStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
  };

  const estadoBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '400',
  };

  const loadingStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    fontSize: '15px',
  };

  const errorStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '80px auto',
    padding: '32px',
    textAlign: 'center',
    color: '#991b1b',
  };

  const errorTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
  };

  const errorMessageStyle: React.CSSProperties = {
    fontSize: '15px',
    marginBottom: '24px',
    color: '#6b7280',
  };

  const errorButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    background: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'inherit',
  };

  const emptyStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#9ca3af',
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#6b7280',
  };

  const emptyMessageStyle: React.CSSProperties = {
    fontSize: '14px',
  };

  const misMateriasLinkStyle: React.CSSProperties = {
    marginTop: '24px',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: '500',
    color: '#2563eb',
    textDecoration: 'none',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.2s',
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
    maxWidth: '800px',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  const modalHeaderStyle: React.CSSProperties = {
    padding: '24px',
    borderBottom: '2px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 10,
    borderRadius: '16px 16px 0 0',
  };

  const modalBodyStyle: React.CSSProperties = {
    padding: '24px',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
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

  if (loading) {
    return (
      <div style={backgroundContainerStyle}>
        <div style={loadingStyle}>
          <RefreshCw size={20} className="animate-spin" style={{ marginRight: '8px' }} />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={backgroundContainerStyle}>
        <div style={errorStyle}>
          <h2 style={errorTitleStyle}>Error</h2>
          <p style={errorMessageStyle}>{error}</p>
          <button
            onClick={fetchMiCursada}
            style={errorButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#111827'}
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!cursadaData) {
    return (
      <div style={backgroundContainerStyle}>
        <div style={containerStyle}>
          <div style={emptyStyle}>
            <h3 style={emptyTitleStyle}>Sin información de cursada</h3>
            <p style={emptyMessageStyle}>
              No se encontró información de cursada para tu usuario.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { curso, materias } = cursadaData;
  const totalMaterias = materias?.length || 0;

  return (
    <div style={backgroundContainerStyle}>
      <div style={containerStyle}>
        {/* Header del curso */}
        <div style={cursoCardStyle}>
          <h2 style={mainTitleStyle}>MI CURSO</h2>
          <h1 style={cursoNombreStyle}>{curso.nombre}</h1>

          <div style={statsLineStyle}>
            <div style={statStyle}>
              <span style={statLabelStyle}>Materias Totales</span>
              <span style={statNumberStyle}>{totalMaterias}</span>
            </div>

            <div style={statDividerStyle}></div>

            <div style={statStyle}>
              <span style={statLabelStyle}>Año Escolar</span>
              <span style={statNumberStyle}>{curso.anio_escolar}</span>
            </div>
          </div>

          {/* Link para ver mis materias */}
          <div style={{ marginTop: '32px' }}>
            <a
              onClick={() => setMostrarModalMaterias(true)}
              style={misMateriasLinkStyle}
              onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
            >
              📚 Ver Mis Materias
            </a>
          </div>
        </div>

        {/* Modal de materias */}
        {mostrarModalMaterias && (
          <div style={modalOverlayStyle} onClick={() => setMostrarModalMaterias(false)}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              {/* Header del modal */}
              <div style={modalHeaderStyle}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  📚 Mis Materias
                </h2>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {curso.nombre} - Año Escolar {curso.anio_escolar}
                </p>
                <button
                  onClick={() => setMostrarModalMaterias(false)}
                  style={closeButtonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                >
                  ✕
                </button>
              </div>

              {/* Body del modal */}
              <div style={modalBodyStyle}>
                <div style={{ ...materiasContainerStyle, boxShadow: 'none', border: 'none', padding: 0 }}>
                  <div style={sectionTitleStyle}>
                    <span>Mis Materias</span>
                    <button
                      onClick={fetchMiCursada}
                      disabled={isRefreshing}
                      style={refreshButtonStyle}
                      onMouseEnter={(e) => {
                        if (!isRefreshing) {
                          e.currentTarget.style.background = '#f9fafb';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isRefreshing) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }
                      }}
                    >
                      <RefreshCw size={14} style={{
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                      }} />
                      Actualizar
                    </button>
                  </div>

                  {materias && materias.length > 0 ? (
                    <ul style={materiasListStyle}>
                      {materias.map((materia) => (
                        <li
                          key={materia.id}
                          style={materiaItemStyle}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fafafa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span style={materiaNombreStyle}>{materia.nombre}</span>
                          <div style={estadoBadgeStyle}>
                            {getEstadoIcon(materia.estado)}
                            <span>{materia.estado}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={emptyStyle}>
                      <p style={emptyTitleStyle}>No hay materias asignadas</p>
                      <p style={emptyMessageStyle}>
                        Contacta con administración para que asignen materias a tu curso.
                      </p>
                    </div>
                  )}
                </div>
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
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
