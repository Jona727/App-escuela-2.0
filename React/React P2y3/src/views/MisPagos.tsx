import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Calendar, RefreshCw, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface Pago {
  id: number;
  amount: number;
  fecha_pago: string;
  mes_afectado: string;
  curso: string;
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px'
  },
  estadoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white'
  },
  estadoCardPendiente: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white'
  },
  estadoCardError: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '32px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px'
  },
  sectionIcon: {
    marginRight: '12px',
    color: '#0891b2'
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
  estadoInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  estadoDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  estadoTexto: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0'
  },
  estadoSubtexto: {
    fontSize: '16px',
    opacity: 0.9,
    margin: '0'
  },
  estadoIcon: {
    width: '48px',
    height: '48px'
  },
  statsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center' as const,
    border: '1px solid #e2e8f0'
  },
  statsIcon: {
    width: '32px',
    height: '32px',
    color: '#0891b2',
    margin: '0 auto 12px'
  },
  statsNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  statsLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0'
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb'
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb'
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  tableHeaderRow: {
    backgroundColor: '#f3f4f6'
  },
  th: {
    padding: '12px 24px',
    textAlign: 'left' as const,
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#1f2937',
    borderBottom: '1px solid #f3f4f6'
  },
  pagoRow: {
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  },
  loading: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
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
    borderTop: '3px solid #0891b2',
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
    background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
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
  },
  mesActualBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: '8px'
  }
};

// CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .pago-row:hover {
    background-color: #f9fafb !important;
  }
  
  @media (max-width: 768px) {
    .stats-grid-responsive {
      grid-template-columns: 1fr !important;
    }
    .table-responsive {
      overflow-x: auto;
    }
  }
`;
document.head.appendChild(styleSheet);

export default function MisPagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [estadoCuenta, setEstadoCuenta] = useState("Cargando...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mesActual = new Date().toISOString().slice(0, 7); // YYYY-MM

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      if (!loading) setIsRefreshing(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const decoded: any = jwtDecode(token);
      const username = decoded?.username;

      if (!username) {
        throw new Error('Token inválido - no se encontró username');
      }

      const response = await fetch(`http://localhost:8000/payment/user/${username}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido o expirado');
        }
        if (response.status === 404) {
          throw new Error('No se encontraron pagos para este usuario');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any[] = await response.json();
      
      const pagosFormateados = data.map(p => ({
        id: p.id,
        amount: p.amount,
        fecha_pago: p.fecha_pago,
        mes_afectado: p.mes_afectado.slice(0, 7),
        curso: p.curso
      }));
      
      setPagos(pagosFormateados);

      const yaPagoEsteMes = pagosFormateados.some(p => p.mes_afectado === mesActual);
      setEstadoCuenta(yaPagoEsteMes ? "Al día" : "Pendiente");

    } catch (err) {
      console.error("Error al obtener pagos:", err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los pagos';
      setError(errorMessage);
      setPagos([]);
      setEstadoCuenta("Error al cargar");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getEstadoCardStyle = () => {
    switch (estadoCuenta) {
      case "Al día":
        return styles.estadoCard;
      case "Pendiente":
        return styles.estadoCardPendiente;
      case "Error al cargar":
      case "No autenticado":
      case "Token inválido":
        return styles.estadoCardError;
      default:
        return styles.card;
    }
  };

  const getEstadoIcon = () => {
    switch (estadoCuenta) {
      case "Al día":
        return <CheckCircle style={styles.estadoIcon} />;
      case "Pendiente":
        return <AlertCircle style={styles.estadoIcon} />;
      case "Error al cargar":
      case "No autenticado":
      case "Token inválido":
        return <XCircle style={styles.estadoIcon} />;
      default:
        return <DollarSign style={styles.estadoIcon} />;
    }
  };

  const getPagosStats = () => {
    const totalPagado = pagos.reduce((sum, pago) => sum + pago.amount, 0);
    const pagosEsteMes = pagos.filter(p => p.mes_afectado === mesActual).length;
    const ultimoPago = pagos.length > 0 ? new Date(Math.max(...pagos.map(p => new Date(p.fecha_pago).getTime()))) : null;
    
    return {
      total: pagos.length,
      totalPagado,
      pagosEsteMes,
      ultimoPago: ultimoPago ? ultimoPago.toLocaleDateString() : 'N/A'
    };
  };

  const formatearMes = (mesAfectado: string) => {
    const [year, month] = mesAfectado.split('-');
    const fecha = new Date(parseInt(year), parseInt(month) - 1);
    return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  const esDelMesActual = (mesAfectado: string) => {
    return mesAfectado === mesActual;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <span style={styles.loadingText}>Cargando tus pagos...</span>
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
              onClick={fetchPagos}
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

  const stats = getPagosStats();

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Mis Pagos</h1>
          <p style={styles.subtitle}>Historial de pagos y estado de cuenta</p>
        </div>

        <div style={styles.grid}>
          {/* Estado de Cuenta */}
          <div style={getEstadoCardStyle()}>
            <div style={styles.sectionHeader}>
              <CreditCard size={24} style={styles.sectionIconWhite} />
              <h2 style={styles.sectionTitleWhite}>Estado de Cuenta</h2>
            </div>
            
            <div style={styles.estadoInfo}>
              <div style={styles.estadoDetails}>
                <h3 style={styles.estadoTexto}>{estadoCuenta}</h3>
                <p style={styles.estadoSubtexto}>
                  {estadoCuenta === "Al día" 
                    ? "Tus pagos están al corriente" 
                    : estadoCuenta === "Pendiente"
                    ? "Tienes pagos pendientes"
                    : "Verifica tu información"}
                </p>
              </div>
              {getEstadoIcon()}
            </div>
          </div>

          {/* Estadísticas */}
          <div style={styles.statsGrid} className="stats-grid-responsive">
            <div style={styles.statsCard}>
              <DollarSign style={styles.statsIcon} />
              <p style={styles.statsNumber}>{stats.total}</p>
              <p style={styles.statsLabel}>Total de Pagos</p>
            </div>
            
            <div style={styles.statsCard}>
              <TrendingUp style={styles.statsIcon} />
              <p style={styles.statsNumber}>${stats.totalPagado.toLocaleString()}</p>
              <p style={styles.statsLabel}>Total Pagado</p>
            </div>
            
            <div style={styles.statsCard}>
              <Calendar style={styles.statsIcon} />
              <p style={styles.statsNumber}>{stats.ultimoPago}</p>
              <p style={styles.statsLabel}>Último Pago</p>
            </div>
          </div>

          {/* Historial de Pagos */}
          <div style={styles.card}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={styles.sectionHeader}>
                <DollarSign size={24} style={styles.sectionIcon} />
                <h3 style={styles.sectionTitle}>Historial de Pagos</h3>
              </div>
              
              <button
                onClick={fetchPagos}
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

            {pagos.length > 0 ? (
              <div style={styles.tableContainer} className="table-responsive">
                <table style={styles.table}>
                  <thead style={styles.tableHeaderRow}>
                    <tr>
                      <th style={styles.th}>Mes Afectado</th>
                      <th style={styles.th}>Curso</th>
                      <th style={styles.th}>Monto</th>
                      <th style={styles.th}>Fecha de Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos
                      .sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())
                      .map((pago) => (
                      <tr 
                        key={pago.id} 
                        style={styles.pagoRow}
                        className="pago-row"
                      >
                        <td style={styles.td}>
                          {formatearMes(pago.mes_afectado)}
                          {esDelMesActual(pago.mes_afectado) && (
                            <span style={styles.mesActualBadge}>Mes actual</span>
                          )}
                        </td>
                        <td style={styles.td}>{pago.curso}</td>
                        <td style={styles.td}>
                          <span style={{ fontWeight: '600' }}>${pago.amount.toLocaleString()}</span>
                        </td>
                        <td style={styles.td}>
                          {new Date(pago.fecha_pago).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <CreditCard style={styles.emptyIcon} />
                <h4 style={styles.emptyTitle}>No hay pagos registrados</h4>
                <p style={styles.emptyMessage}>
                  Aún no tienes pagos registrados en el sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}