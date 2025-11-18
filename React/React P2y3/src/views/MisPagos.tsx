import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface Pago {
  id: number;
  amount: number;
  fecha_pago: string;
  mes_afectado: string;
  curso: string;
}

const MisPagos = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const mesActual = new Date().toISOString().slice(0, 7);

  // Función para generar meses esperados del año actual hasta el mes actual
  const generarMesesDelAnio = () => {
    const meses: string[] = [];
    const añoActual = new Date().getFullYear();
    const mesActualNumero = new Date().getMonth() + 1; // 1-12

    for (let mes = 1; mes <= mesActualNumero; mes++) {
      const mesStr = mes.toString().padStart(2, '0');
      meses.push(`${añoActual}-${mesStr}`);
    }
    return meses;
  };

  const mesesEsperados = generarMesesDelAnio();
  const mesesPagados = pagos.map(p => p.mes_afectado);
  const mesesPendientes = mesesEsperados.filter(mes => !mesesPagados.includes(mes));
  const alDia = mesesPendientes.length === 0;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
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

      } catch (err) {
        console.error("Error al obtener pagos:", err);
        setPagos([]);
      }
    };

    fetchPagos();
  }, []);

  // Estilos (idénticos a Pagos.tsx)
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

  const estadoCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: alDia ? '2px solid #10b981' : '2px solid #ef4444',
    marginBottom: '32px',
    textAlign: 'center',
    maxWidth: '450px',
    margin: '0 auto 32px auto',
  };

  const estadoIconStyle: React.CSSProperties = {
    fontSize: isMobile ? '32px' : '40px',
    marginBottom: '12px',
  };

  const estadoTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    color: alDia ? '#10b981' : '#ef4444',
    marginBottom: '6px',
  };

  const estadoMessageStyle: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#6b7280',
    marginBottom: mesesPendientes.length > 0 ? '12px' : '0',
  };

  const mesesPendientesStyle: React.CSSProperties = {
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600',
    color: '#374151',
  };

  const tableContainerStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    overflowX: 'auto',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const theadStyle: React.CSSProperties = {
    background: '#f9fafb',
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

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#9ca3af',
    fontSize: isMobile ? '14px' : '15px',
  };

  return (
    <div style={containerStyle}>
      
      {/* Tarjeta de Estado de Pagos */}
      <div style={estadoCardStyle}>
        {alDia && (
          <div style={estadoIconStyle}>
            ✅
          </div>
        )}
        <h2 style={estadoTitleStyle}>
          {alDia ? '¡Estás al día!' : 'Tienes pagos pendientes'}
        </h2>
        <p style={estadoMessageStyle}>
          {alDia
            ? 'No tienes pagos pendientes. ¡Excelente!'
            : `Tienes ${mesesPendientes.length} mes${mesesPendientes.length > 1 ? 'es' : ''} pendiente${mesesPendientes.length > 1 ? 's' : ''} de pago`
          }
        </p>
        {!alDia && mesesPendientes.length > 0 && (
          <p style={mesesPendientesStyle}>
            {mesesPendientes.length} {mesesPendientes.length === 1 ? 'mes debe' : 'meses deben'} ser pagado{mesesPendientes.length === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {/* Sección de historial */}
      <div style={{ marginBottom: '16px' }}>
        <p style={headerSubtitleStyle}>Visualiza tu historial de pagos y estadísticas</p>
      </div>

      {/* Tabla de pagos */}
      <div style={tableContainerStyle}>
        {pagos.length === 0 ? (
          <div style={emptyStateStyle}>
             No hay pagos registrados todavía
          </div>
        ) : (
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                <th style={thStyle}> Curso</th>
                <th style={thStyle}> Monto</th>
                <th style={thStyle}> Mes</th>
                <th style={thStyle}> Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pagos
                .sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())
                .map(p => (
                  <tr key={p.id}>
                    <td style={tdStyle}>{p.curso}</td>
                    <td style={{ ...tdStyle, fontWeight: '600', color: '#10b981' }}>
                      ${p.amount.toLocaleString('es-AR')}
                    </td>
                    <td style={tdStyle}>{p.mes_afectado}</td>
                    <td style={tdStyle}>
                      {new Date(p.fecha_pago).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MisPagos;
