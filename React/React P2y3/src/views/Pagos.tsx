import { useEffect, useState } from "react";
import Select from 'react-select';

// Tipos
interface Usuario {
  id: number;
  firstname: string;
  lastname: string;
}

interface Curso {
  id: number;
  name: string;
}

interface Pago {
  id: number;
  amount: number;
  fecha_pago: string;
  mes_afectado: string;
  usuario: string;
  carrera: string;
}

interface AlumnoPagos {
  nombreAlumno: string;
  pagos: Pago[];
  totalPagado: number;
  mesesPagados: string[];
  mesesDebe: string[];
  alDia: boolean;
}

const Pagos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [usuarioPago, setUsuarioPago] = useState("");
  const [cursoPago, setCursoPago] = useState("");
  const [monto, setMonto] = useState("");
  const [mesPago, setMesPago] = useState("");

  // Estados para Infinite Scroll
  const [opcionesUsuarios, setOpcionesUsuarios] = useState<{ value: number; label: string }[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const mesActual = new Date().toISOString().slice(0, 7);

  // Función para cargar usuarios con paginación
  const fetchUsers = async (lastSeenId?: number) => {
    if (isLoadingUsers) return;

    setIsLoadingUsers(true);
    try {
      const url = lastSeenId
        ? `http://localhost:8000/users/all?limit=20&last_seen_id=${lastSeenId}`
        : `http://localhost:8000/users/all?limit=20`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.users && Array.isArray(data.users)) {
        const newOptions = data.users.map((u: Usuario) => ({
          value: u.id,
          label: `${u.firstname} ${u.lastname}`,
        }));

        setOpcionesUsuarios((prev) => [...prev, ...newOptions]);
        setNextCursor(data.next_cursor || null);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Handler para cargar más usuarios al hacer scroll
  const handleMenuScrollToBottom = () => {
    if (nextCursor && !isLoadingUsers) {
      fetchUsers(nextCursor);
    }
  };

  // Función para generar meses del año actual hasta el mes actual
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

  // Función para agrupar pagos por alumno y calcular estado
  const agruparPagosPorAlumno = (): AlumnoPagos[] => {
    const grupos: { [key: string]: Pago[] } = {};

    // Agrupar pagos por alumno
    pagos.forEach((pago) => {
      if (!grupos[pago.usuario]) {
        grupos[pago.usuario] = [];
      }
      grupos[pago.usuario].push(pago);
    });

    const mesesEsperados = generarMesesDelAnio();

    // Crear array de AlumnoPagos con información de estado
    return Object.entries(grupos).map(([nombreAlumno, pagosList]) => {
      const mesesPagados = pagosList.map(p => p.mes_afectado);
      const mesesDebe = mesesEsperados.filter(mes => !mesesPagados.includes(mes));
      const totalPagado = pagosList.reduce((acc, p) => acc + p.amount, 0);
      const alDia = mesesDebe.length === 0;

      return {
        nombreAlumno,
        pagos: pagosList.sort((a, b) => a.mes_afectado.localeCompare(b.mes_afectado)),
        totalPagado,
        mesesPagados,
        mesesDebe,
        alDia
      };
    }).sort((a, b) => a.nombreAlumno.localeCompare(b.nombreAlumno));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Cargar primeros 20 usuarios
    fetchUsers();

    fetch("http://localhost:8000/cursos/all")
      .then(res => res.json())
      .then(data => setCursos(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error al cargar cursos:", err);
        setCursos([]);
      });

    fetch("http://localhost:8000/payment/paginated")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const pagosFormateados = data.map((p: any) => ({
            id: p.id_pago,
            amount: p.monto,
            fecha_pago: p.fecha_de_pago,
            mes_afectado: p.mes_pagado.slice(0, 7),
            usuario: p.alumno,
            carrera: p.curso_afectado,
          }));
          setPagos(pagosFormateados);
        } else {
          setPagos([]);
        }
      })
      .catch(err => {
        console.error("Error al cargar pagos:", err);
        setPagos([]);
      });
  }, []);

  const registrarPago = () => {
    if (!usuarioPago || !cursoPago || !monto || !mesPago) {
      alert("Por favor completa todos los campos");
      return;
    }

    const fechaAfectada = `${mesPago}-01`;

    fetch("http://localhost:8000/payment/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: parseInt(usuarioPago),
        curso_id: parseInt(cursoPago),
        amount: parseFloat(monto),
        affect_month: fechaAfectada,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(() => {
        setUsuarioPago("");
        setCursoPago("");
        setMonto("");
        setMesPago("");
        window.location.reload();
      })
      .catch(err => {
        console.error("Error al registrar pago:", err);
        alert("Error al registrar el pago");
      });
  };

  const eliminarPago = (id: number) => {
    fetch(`http://localhost:8000/payment/delete/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => setPagos(pagos.filter(p => p.id !== id)));
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

  const cardsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  };

  const statCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const statValueBaseStyle: React.CSSProperties = {
    fontSize: isMobile ? '28px' : '32px',
    fontWeight: '600',
  };

  const registroCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    marginBottom: '32px',
  };

  const registroTitleStyle: React.CSSProperties = {
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
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
    gap: isMobile ? '12px' : '16px',
    marginBottom: '20px',
  };

  const inputStyle: React.CSSProperties = {
    padding: isMobile ? '10px 14px' : '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: isMobile ? '14px' : '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    background: 'white',
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: isMobile ? '12px 24px' : '12px 32px',
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

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#9ca3af',
    fontSize: isMobile ? '14px' : '15px',
  };

  const alumnoCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: isMobile ? '20px' : '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  };

  const alumnoHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const alumnoNombreStyle: React.CSSProperties = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    color: '#111827',
  };

  const estadoBadgeStyle = (alDia: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    background: alDia ? '#d1fae5' : '#fee2e2',
    color: alDia ? '#065f46' : '#991b1b',
  });

  const pagosGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  };

  const pagoItemStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  };

  const mesLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const montoStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#10b981',
  };

  const mesesDebeStyle: React.CSSProperties = {
    marginTop: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
  };

  const mesesDebeListStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  };

  const mesDebeBadgeStyle: React.CSSProperties = {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#fee2e2',
    color: '#991b1b',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <h1 style={headerTitleStyle}> Gestión de Pagos</h1>
        <p style={headerSubtitleStyle}>Administra pagos y cuotas de manera eficiente</p>
      </div>

      {/* Formulario de registro */}
      <div style={registroCardStyle}>
        <h2 style={registroTitleStyle}>
           Registrar Nuevo Pago
        </h2>

        <div style={formGridStyle}>
          <Select
            options={opcionesUsuarios}
            value={opcionesUsuarios.find(op => op.value === parseInt(usuarioPago)) || null}
            onChange={(selectedOption) => setUsuarioPago(selectedOption ? String(selectedOption.value) : "")}
            onMenuScrollToBottom={handleMenuScrollToBottom}
            placeholder=" Buscar y seleccionar alumno..."
            isClearable
            isSearchable
            isLoading={isLoadingUsers}
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

          <select
            value={cursoPago}
            onChange={e => setCursoPago(e.target.value)}
            style={selectStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          >
            <option value=""> Seleccionar curso</option>
            {cursos.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder=" Monto"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          />

          <input
            type="month"
            value={mesPago}
            onChange={e => setMesPago(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          />
        </div>

        <button
          onClick={registrarPago}
          style={primaryButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
        >
           Registrar Pago
        </button>
      </div>

      {/* Grid de pagos por alumno */}
      <div>
        {pagos.length === 0 ? (
          <div style={tableContainerStyle}>
            <div style={emptyStateStyle}>
               No hay pagos registrados todavía
            </div>
          </div>
        ) : (
          agruparPagosPorAlumno().map((alumnoData) => (
            <div key={alumnoData.nombreAlumno} style={alumnoCardStyle}>
              {/* Header del alumno */}
              <div style={alumnoHeaderStyle}>
                <div>
                  <h3 style={alumnoNombreStyle}>{alumnoData.nombreAlumno}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                    Total pagado: <span style={{ fontWeight: '600', color: '#10b981' }}>
                      ${alumnoData.totalPagado.toLocaleString('es-AR')}
                    </span>
                  </p>
                </div>
                <span style={estadoBadgeStyle(alumnoData.alDia)}>
                  {alumnoData.alDia ? '✓ Al día' : '⚠ Debe meses'}
                </span>
              </div>

              {/* Grid de pagos realizados */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Pagos Realizados ({alumnoData.pagos.length})
                </h4>
                <div style={pagosGridStyle}>
                  {alumnoData.pagos.map((pago) => (
                    <div key={pago.id} style={pagoItemStyle}>
                      <div style={mesLabelStyle}>
                        {new Date(pago.mes_afectado + '-01').toLocaleDateString('es-AR', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <div style={montoStyle}>
                        ${pago.amount.toLocaleString('es-AR')}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                        {pago.carrera}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {new Date(pago.fecha_pago).toLocaleDateString('es-AR')}
                      </div>
                      <button
                        onClick={() => eliminarPago(pago.id)}
                        style={{
                          ...deleteButtonStyle,
                          width: '100%',
                          marginTop: '8px',
                          fontSize: '11px',
                          padding: '4px 8px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meses que debe */}
              {alumnoData.mesesDebe.length > 0 && (
                <div style={mesesDebeStyle}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>
                    ⚠ Meses pendientes de pago ({alumnoData.mesesDebe.length})
                  </h4>
                  <div style={mesesDebeListStyle}>
                    {alumnoData.mesesDebe.map((mes) => (
                      <span key={mes} style={mesDebeBadgeStyle}>
                        {new Date(mes + '-01').toLocaleDateString('es-AR', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pagos;
