import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Calendar, RefreshCw, Award, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
    gap: '32px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px'
  },
  cursoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
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
  sectionIconWhite: {
    marginRight: '12px',
    color: 'white'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0'
  },
  sectionTitleWhite: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0'
  },
  cursoInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '24px',
    alignItems: 'center'
  },
  cursoDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  cursoNombre: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0'
  },
  cursoAnio: {
    fontSize: '18px',
    opacity: 0.9,
    margin: '0'
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
  badgeActivo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  badgeInactivo: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
    border: '1px solid rgba(239, 68, 68, 0.2)'
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const,
    minWidth: '120px'
  },
  statsNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 4px 0'
  },
  statsLabel: {
    fontSize: '14px',
    opacity: 0.9,
    margin: '0'
  },
  materiasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  materiaCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  materiaCardHover: {
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transform: 'translateY(-2px)'
  },
  materiaNombre: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  estadoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  estadoCursando: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  estadoAprobado: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  estadoDesaprobado: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  estadoPendiente: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  estadoDefault: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
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
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const
  },
  errorTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 8px 0'
  },
  errorMessage: {
    margin: '0 0 16px 0'
  },
  button: {
    padding: '12px 24px',
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
    justifyContent: 'center',
    gap: '8px'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#6b7280'
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 16px',
    color: '#d1d5db'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0'
  },
  emptyMessage: {
    margin: '0'
  }
};

// CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .materia-card-hover:hover {
    background-color: #ffffff !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    transform: translateY(-2px) !important;
  }
  
  @media (max-width: 768px) {
    .curso-info-responsive {
      grid-template-columns: 1fr !important;
      text-align: center;
    }
    .materias-grid-responsive {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default function MiCursada() {
  const [cursadaData, setCursadaData] = useState<CursadaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        return <Clock size={16} />;
      case 'aprobado':
        return <CheckCircle size={16} />;
      case 'desaprobado':
        return <XCircle size={16} />;
      case 'pendiente':
        return <AlertCircle size={16} />;
      default:
        return <BookOpen size={16} />;
    }
  };

  const getEstadoStyle = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'cursando':
        return { ...styles.estadoBadge, ...styles.estadoCursando };
      case 'aprobado':
        return { ...styles.estadoBadge, ...styles.estadoAprobado };
      case 'desaprobado':
        return { ...styles.estadoBadge, ...styles.estadoDesaprobado };
      case 'pendiente':
        return { ...styles.estadoBadge, ...styles.estadoPendiente };
      default:
        return { ...styles.estadoBadge, ...styles.estadoDefault };
    }
  };

  const getMateriasStats = (materias: Materia[]) => {
    const stats = {
      total: materias.length,
      aprobadas: materias.filter(m => m.estado?.toLowerCase() === 'aprobado').length,
      cursando: materias.filter(m => m.estado?.toLowerCase() === 'cursando').length,
      pendientes: materias.filter(m => m.estado?.toLowerCase() === 'pendiente').length
    };
    return stats;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <span style={styles.loadingText}>Cargando tu cursada...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.errorCard}>
            <h2 style={styles.errorTitle}>Error al cargar la información</h2>
            <p style={styles.errorMessage}>{error}</p>
            <button 
              onClick={fetchMiCursada}
              style={styles.button}
            >
              <RefreshCw size={16} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cursadaData) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <GraduationCap style={styles.emptyIcon} />
              <h3 style={styles.emptyTitle}>Sin información de cursada</h3>
              <p style={styles.emptyMessage}>
                No se encontró información de cursada para tu usuario.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { curso, materias } = cursadaData;
  const stats = getMateriasStats(materias || []);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Mi Cursada</h1>
          <p style={styles.subtitle}>Información de tu curso y materias asignadas</p>
        </div>

        <div style={styles.grid}>
          {/* Información del Curso */}
          <div style={styles.cursoCard}>
            <div style={styles.sectionHeader}>
              <GraduationCap size={24} style={styles.sectionIconWhite} />
              <h2 style={styles.sectionTitleWhite}>Mi Curso</h2>
            </div>
            
            <div style={styles.cursoInfo} className="curso-info-responsive">
              <div style={styles.cursoDetails}>
                <h3 style={styles.cursoNombre}>{curso.nombre}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Calendar size={16} />
                  <span style={styles.cursoAnio}>Año Escolar: {curso.anio_escolar}</span>
                </div>

              </div>
              
              <div style={styles.statsCard}>
                <p style={styles.statsNumber}>{stats.total}</p>
                <p style={styles.statsLabel}>Materias Totales</p>
              </div>
            </div>
          </div>

          {/* Materias */}
          <div style={styles.card}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={styles.sectionHeader}>
                <BookOpen size={24} style={styles.sectionIcon} />
                <h3 style={styles.sectionTitle}>Mis Materias</h3>
              </div>
              
              <button
                onClick={fetchMiCursada}
                disabled={isRefreshing}
                style={{
                  ...styles.button,
                  padding: '8px 16px',
                  fontSize: '14px',
                  opacity: isRefreshing ? 0.6 : 1
                }}
              >
                <RefreshCw size={14} style={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                }} />
                Actualizar
              </button>
            </div>
            
            {materias && materias.length > 0 ? (
              <div style={styles.materiasGrid} className="materias-grid-responsive">
                {materias.map((materia) => (
                  <div 
                    key={materia.id} 
                    style={styles.materiaCard}
                    className="materia-card-hover"
                  >
                    <h4 style={styles.materiaNombre}>{materia.nombre}</h4>
                    <div style={getEstadoStyle(materia.estado)}>
                      {getEstadoIcon(materia.estado)}
                      {materia.estado}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <BookOpen style={styles.emptyIcon} />
                <h4 style={styles.emptyTitle}>No hay materias asignadas</h4>
                <p style={styles.emptyMessage}>
                  Contacta con administración para que asignen materias a tu curso.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}