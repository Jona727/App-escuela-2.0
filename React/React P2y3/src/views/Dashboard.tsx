import React, { useEffect, useState } from 'react';
import { BookOpen, CreditCard, Bell, Calendar, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.firstname || user.firstName || "Usuario";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Estilos minimalistas
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
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

  const cardsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  };

  const quickAccessCardStyle: React.CSSProperties = {
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

  const iconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  };

  const progressContainerStyle: React.CSSProperties = {
    marginTop: '12px',
  };

  const progressLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  const progressBarBackgroundStyle: React.CSSProperties = {
    width: '100%',
    height: '6px',
    background: '#f3f4f6',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const progressBarFillStyle = (percentage: number): React.CSSProperties => ({
    width: `${percentage}%`,
    height: '100%',
    background: '#10b981',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  });

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
  };

  const statIconStyle: React.CSSProperties = {
    color: '#10b981',
    flexShrink: 0,
  };

  const statContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  };

  return (
    <div style={containerStyle}>
      {/* Welcome Card */}
      <div style={welcomeCardStyle}>
        <p style={greetingStyle}>Bienvenido de nuevo,</p>
        <h1 style={userNameStyle}>{userName}</h1>
        <p style={subtitleStyle}>
          Panel de control - Gestiona tu actividad académica y mantente al día con tus tareas.
        </p>
      </div>

      {/* Quick Access Cards */}
      <h2 style={sectionTitleStyle}>Acceso Rápido</h2>
      <div style={cardsGridStyle}>
        {/* Mi Cursada Card */}
        <div
          style={quickAccessCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle}>
            <BookOpen size={24} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={cardTitleStyle}>Mi Cursada</h3>
            <p style={cardDescriptionStyle}>
              Accede a tus materias, horarios y progreso académico
            </p>
          </div>
          <div style={progressContainerStyle}>
            <div style={progressLabelStyle}>
              <span>Progreso del semestre</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>75%</span>
            </div>
            <div style={progressBarBackgroundStyle}>
              <div style={progressBarFillStyle(75)}></div>
            </div>
          </div>
        </div>

        {/* Próximos Pagos Card */}
        <div
          style={quickAccessCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle}>
            <CreditCard size={24} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={cardTitleStyle}>Próximos Pagos</h3>
            <p style={cardDescriptionStyle}>
              Revisa tus cuotas pendientes y estado de cuenta
            </p>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={statItemStyle}>
              <Calendar size={18} style={statIconStyle} />
              <div style={statContentStyle}>
                <p style={statLabelStyle}>Próximo vencimiento</p>
                <p style={{ ...statValueStyle, fontSize: '16px' }}>15 de Diciembre</p>
              </div>
            </div>
          </div>
        </div>

        {/* Novedades Card */}
        <div
          style={quickAccessCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle}>
            <Bell size={24} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={cardTitleStyle}>Novedades</h3>
            <p style={cardDescriptionStyle}>
              Mantente informado sobre anuncios y actualizaciones
            </p>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Inscripciones abiertas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Nuevo contenido disponible</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
