import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, DollarSign, BookOpen, TrendingUp, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.firstname || user.firstName || "Administrador";
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Estilos
  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '40px 24px' : '60px 40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const welcomeCardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: isMobile ? '32px 24px' : '40px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    marginBottom: '48px',
  };

  const greetingStyle: React.CSSProperties = {
    fontSize: isMobile ? '14px' : '16px',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: '500',
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: isMobile ? '28px' : '36px',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '8px',
    letterSpacing: '-0.025em',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '15px' : '16px',
    color: '#6b7280',
    lineHeight: '1.6',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
    letterSpacing: '-0.02em',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '48px',
  };

  const statCardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.2s',
  };

  const statIconContainerStyle = (bgColor: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  });

  const statValueStyle: React.CSSProperties = {
    fontSize: isMobile ? '28px' : '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  };

  const statChangeStyle = (isPositive: boolean): React.CSSProperties => ({
    fontSize: '13px',
    color: isPositive ? '#10b981' : '#ef4444',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  });

  const quickActionsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '48px',
  };

  const actionCardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const actionIconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const actionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  };

  const actionDescriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  };

  const recentActivityStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: isMobile ? '24px' : '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const activityItemStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const activityIconStyle = (bgColor: string): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  });

  const activityContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const activityTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '4px',
  };

  const activityTimeStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
  };

  const alertCardStyle: React.CSSProperties = {
    background: '#fef3c7',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #fbbf24',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  };

  const alertTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#92400e',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      {/* Welcome Card */}
      <div style={welcomeCardStyle}>
        <p style={greetingStyle}>Panel de Administración</p>
        <h1 style={userNameStyle}>{userName}</h1>
        <p style={subtitleStyle}>
          Gestiona estudiantes, cursos, pagos y toda la información de tu institución educativa.
        </p>
      </div>

      {/* Alerta de Acciones Pendientes */}
      <div style={alertCardStyle}>
        <AlertCircle size={24} style={{ color: '#f59e0b', flexShrink: 0 }} />
        <span style={alertTextStyle}>
          Tienes 3 solicitudes de inscripción pendientes de revisión
        </span>
      </div>

      {/* Estadísticas Principales */}
      <h2 style={sectionTitleStyle}>Estadísticas Generales</h2>
      <div style={statsGridStyle}>
        {/* Total de Estudiantes */}
        <div style={statCardStyle}>
          <div style={statIconContainerStyle('#dbeafe')}>
            <Users size={24} style={{ color: '#2563eb' }} />
          </div>
          <p style={statLabelStyle}>Total Estudiantes</p>
          <h3 style={statValueStyle}>245</h3>
          <div style={statChangeStyle(true)}>
            <TrendingUp size={14} />
            <span>+12% este mes</span>
          </div>
        </div>

        {/* Cursos Activos */}
        <div style={statCardStyle}>
          <div style={statIconContainerStyle('#dcfce7')}>
            <GraduationCap size={24} style={{ color: '#10b981' }} />
          </div>
          <p style={statLabelStyle}>Cursos Activos</p>
          <h3 style={statValueStyle}>18</h3>
          <div style={statChangeStyle(true)}>
            <TrendingUp size={14} />
            <span>+2 nuevos</span>
          </div>
        </div>

        {/* Pagos del Mes */}
        <div style={statCardStyle}>
          <div style={statIconContainerStyle('#fef3c7')}>
            <DollarSign size={24} style={{ color: '#f59e0b' }} />
          </div>
          <p style={statLabelStyle}>Pagos del Mes</p>
          <h3 style={statValueStyle}>$124.5K</h3>
          <div style={statChangeStyle(true)}>
            <TrendingUp size={14} />
            <span>+8% vs mes anterior</span>
          </div>
        </div>

        {/* Materias Totales */}
        <div style={statCardStyle}>
          <div style={statIconContainerStyle('#e0e7ff')}>
            <BookOpen size={24} style={{ color: '#6366f1' }} />
          </div>
          <p style={statLabelStyle}>Materias Totales</p>
          <h3 style={statValueStyle}>42</h3>
          <div style={statChangeStyle(false)}>
            <span>Sin cambios</span>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <h2 style={sectionTitleStyle}>Acciones Rápidas</h2>
      <div style={quickActionsGridStyle}>
        {/* Gestionar Usuarios */}
        <div
          style={actionCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={actionIconContainerStyle}>
            <Users size={24} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={actionTitleStyle}>Gestionar Usuarios</h3>
            <p style={actionDescriptionStyle}>
              Administra estudiantes, profesores y personal
            </p>
          </div>
        </div>

        {/* Gestión Académica */}
        <div
          style={actionCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={actionIconContainerStyle}>
            <GraduationCap size={24} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={actionTitleStyle}>Gestión Académica</h3>
            <p style={actionDescriptionStyle}>
              Administra cursos, materias y asignaciones
            </p>
          </div>
        </div>

        {/* Control de Pagos */}
        <div
          style={actionCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={actionIconContainerStyle}>
            <DollarSign size={24} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={actionTitleStyle}>Control de Pagos</h3>
            <p style={actionDescriptionStyle}>
              Revisa cuotas, pagos y estado financiero
            </p>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <h2 style={sectionTitleStyle}>Actividad Reciente</h2>
      <div style={recentActivityStyle}>
        <div style={activityItemStyle}>
          <div style={activityIconStyle('#dcfce7')}>
            <CheckCircle size={20} style={{ color: '#10b981' }} />
          </div>
          <div style={activityContentStyle}>
            <p style={activityTitleStyle}>Nueva inscripción aprobada</p>
            <p style={activityTimeStyle}>Juan Pérez - Curso 3° Año - Hace 2 horas</p>
          </div>
        </div>

        <div style={activityItemStyle}>
          <div style={activityIconStyle('#dbeafe')}>
            <DollarSign size={20} style={{ color: '#2563eb' }} />
          </div>
          <div style={activityContentStyle}>
            <p style={activityTitleStyle}>Pago registrado</p>
            <p style={activityTimeStyle}>María García - $12,500 - Hace 3 horas</p>
          </div>
        </div>

        <div style={activityItemStyle}>
          <div style={activityIconStyle('#fef3c7')}>
            <BookOpen size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div style={activityContentStyle}>
            <p style={activityTitleStyle}>Nuevo curso creado</p>
            <p style={activityTimeStyle}>Matemática Avanzada - 4° Año - Hace 5 horas</p>
          </div>
        </div>

        <div style={activityItemStyle}>
          <div style={activityIconStyle('#e0e7ff')}>
            <Users size={20} style={{ color: '#6366f1' }} />
          </div>
          <div style={activityContentStyle}>
            <p style={activityTitleStyle}>Nuevo usuario registrado</p>
            <p style={activityTimeStyle}>Carlos Rodríguez - Alumno - Hace 1 día</p>
          </div>
        </div>

        <div style={activityItemStyle}>
          <div style={activityIconStyle('#dcfce7')}>
            <Calendar size={20} style={{ color: '#10b981' }} />
          </div>
          <div style={activityContentStyle}>
            <p style={activityTitleStyle}>Asignación de materia actualizada</p>
            <p style={activityTimeStyle}>Curso 2° Año - Historia - Hace 1 día</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
