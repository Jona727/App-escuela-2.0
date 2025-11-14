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

export default function MisPagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [estadoCuenta, setEstadoCuenta] = useState("Cargando...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const mesActual = new Date().toISOString().slice(0, 7); // YYYY-MM

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const getPagosStats = () => {
    const totalPagado = pagos.reduce((sum, pago) => sum + pago.amount, 0);
    const pagosEsteMes = pagos.filter(p => p.mes_afectado === mesActual).length;
    const ultimoPago = pagos.length > 0 ? new Date(Math.max(...pagos.map(p => new Date(p.fecha_pago).getTime()))) : null;

    return {
      total: pagos.length,
      totalPagado,
      pagosEsteMes,
      ultimoPago: ultimoPago ? ultimoPago.toLocaleDateString('es-ES') : 'N/A'
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

  const getEstadoCardStyle = (): React.CSSProperties => {
    const base = {
      ...cardStyle,
      color: 'white',
    };

    switch (estadoCuenta) {
      case "Al día":
        return { ...base, background: '#10b981' };
      case "Pendiente":
        return { ...base, background: '#f59e0b' };
      default:
        return { ...base, background: '#ef4444' };
    }
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

  const cardTitleWhiteStyle: React.CSSProperties = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const estadoInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const estadoTextoStyle: React.CSSProperties = {
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  };

  const estadoSubtextoStyle: React.CSSProperties = {
    fontSize: isMobile ? '14px' : '16px',
    opacity: 0.95,
    margin: '0',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  };

  const statCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '8px 0 4px 0',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0',
  };

  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
  };

  const thStyle: React.CSSProperties = {
    padding: isMobile ? '10px 12px' : '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  };

  const tdStyle: React.CSSProperties = {
    padding: isMobile ? '12px' : '14px 16px',
    fontSize: isMobile ? '13px' : '14px',
    color: '#111827',
    borderBottom: '1px solid #f3f4f6',
  };

  const mesActualBadgeStyle: React.CSSProperties = {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    marginLeft: '8px',
  };

  const loadingContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f5f7fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const loadingContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#6b7280',
    fontSize: '18px',
  };

  const errorCardStyle: React.CSSProperties = {
    background: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  };

  const errorTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  };

  const errorMessageStyle: React.CSSProperties = {
    margin: '0 0 16px 0',
    fontSize: '15px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: isMobile ? '10px 20px' : '12px 24px',
    background: '#2563eb',
    color: 'white',
    fontWeight: '500',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'inherit',
  };

  const refreshButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    background: 'white',
    color: '#2563eb',
    fontWeight: '500',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    cursor: isRefreshing ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    opacity: isRefreshing ? 0.6 : 1,
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280',
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0',
  };

  const emptyMessageStyle: React.CSSProperties = {
    margin: '0',
    fontSize: '15px',
  };

  const headerFlexStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingContentStyle}>
          <RefreshCw size={24} className="animate-spin" />
          <span>⏳ Cargando tus pagos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorCardStyle}>
          <h2 style={errorTitleStyle}>❌ Error al cargar la información</h2>
          <p style={errorMessageStyle}>{error}</p>
          <button
            onClick={fetchPagos}
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const stats = getPagosStats();

  const getEstadoIcon = () => {
    switch (estadoCuenta) {
      case "Al día":
        return <CheckCircle size={isMobile ? 40 : 48} />;
      case "Pendiente":
        return <AlertCircle size={isMobile ? 40 : 48} />;
      default:
        return <XCircle size={isMobile ? 40 : 48} />;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <h1 style={headerTitleStyle}>💰 Mis Pagos</h1>
        <p style={headerSubtitleStyle}>Historial de pagos y estado de cuenta</p>
      </div>

      {/* Estado de Cuenta */}
      <div style={getEstadoCardStyle()}>
        <h2 style={cardTitleWhiteStyle}>
          <CreditCard size={24} />
          Estado de Cuenta
        </h2>

        <div style={estadoInfoStyle}>
          <div>
            <h3 style={estadoTextoStyle}>{estadoCuenta}</h3>
            <p style={estadoSubtextoStyle}>
              {estadoCuenta === "Al día"
                ? "✅ Tus pagos están al corriente"
                : estadoCuenta === "Pendiente"
                  ? "⚠️ Tienes pagos pendientes"
                  : "❌ Verifica tu información"}
            </p>
          </div>
          {getEstadoIcon()}
        </div>
      </div>

      {/* Estadísticas */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <DollarSign size={28} style={{ margin: '0 auto', color: '#2563eb' }} />
          <p style={statNumberStyle}>{stats.total}</p>
          <p style={statLabelStyle}>📊 Total de Pagos</p>
        </div>

        <div style={statCardStyle}>
          <TrendingUp size={28} style={{ margin: '0 auto', color: '#10b981' }} />
          <p style={statNumberStyle}>${stats.totalPagado.toLocaleString('es-AR')}</p>
          <p style={statLabelStyle}>💵 Total Pagado</p>
        </div>

        <div style={statCardStyle}>
          <Calendar size={28} style={{ margin: '0 auto', color: '#f59e0b' }} />
          <p style={statNumberStyle}>{stats.ultimoPago}</p>
          <p style={statLabelStyle}>📅 Último Pago</p>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div style={cardStyle}>
        <div style={headerFlexStyle}>
          <h3 style={cardTitleStyle}>
            <DollarSign size={24} />
            Historial de Pagos
          </h3>

          <button
            onClick={fetchPagos}
            disabled={isRefreshing}
            style={refreshButtonStyle}
            onMouseEnter={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.background = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            <RefreshCw size={14} style={{
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }} />
            Actualizar
          </button>
        </div>

        {pagos.length > 0 ? (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Mes Afectado</th>
                  <th style={thStyle}>Curso</th>
                  <th style={thStyle}>Monto</th>
                  <th style={thStyle}>Fecha de Pago</th>
                </tr>
              </thead>
              <tbody>
                {pagos
                  .sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())
                  .map((pago) => (
                    <tr
                      key={pago.id}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <td style={tdStyle}>
                        {formatearMes(pago.mes_afectado)}
                        {esDelMesActual(pago.mes_afectado) && (
                          <span style={mesActualBadgeStyle}>Mes actual</span>
                        )}
                      </td>
                      <td style={tdStyle}>{pago.curso}</td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: '600' }}>${pago.amount.toLocaleString('es-AR')}</span>
                      </td>
                      <td style={tdStyle}>
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
          <div style={emptyStateStyle}>
            <CreditCard size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
            <h4 style={emptyTitleStyle}>No hay pagos registrados</h4>
            <p style={emptyMessageStyle}>
              Aún no tienes pagos registrados en el sistema.
            </p>
          </div>
        )}
      </div>

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
  );
}
