import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Settings, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.firstname || user.firstName || "Administrador";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Estilos compactos y profesionales
  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '24px' : '32px 40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
  };

  const greetingStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
    fontWeight: '400',
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
    letterSpacing: '-0.015em',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  };

  const quickAccessGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  };

  const accessCardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const accessIconContainerStyle = (color: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  });

  const accessContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const accessTitleStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  };

  const accessDescriptionStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
  };

  return (
    <div style={containerStyle}>
      {/* Header compacto */}
      <div style={headerStyle}>
        <p style={greetingStyle}>Panel de Administración</p>
        <h1 style={userNameStyle}>{userName}</h1>
        <p style={subtitleStyle}>
          Acceso rápido a las herramientas de gestión institucional
        </p>
      </div>

      {/* Acceso Rápido */}
      <div style={quickAccessGridStyle}>
        {/* Gestión de Usuarios */}
        <div
          style={accessCardStyle}
          onClick={() => navigate('/user')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={accessIconContainerStyle('#dbeafe')}>
            <Users size={24} style={{ color: '#3b82f6' }} />
          </div>
          <div style={accessContentStyle}>
            <h3 style={accessTitleStyle}>Usuarios</h3>
            <p style={accessDescriptionStyle}>Gestionar alumnos y administradores</p>
          </div>
        </div>

        {/* Gestión Académica */}
        <div
          style={accessCardStyle}
          onClick={() => navigate('/GestionAcademica')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={accessIconContainerStyle('#dcfce7')}>
            <Settings size={24} style={{ color: '#10b981' }} />
          </div>
          <div style={accessContentStyle}>
            <h3 style={accessTitleStyle}>Gestión Académica</h3>
            <p style={accessDescriptionStyle}>Materias, cursos y asignaciones</p>
          </div>
        </div>

        {/* Pagos */}
        <div
          style={accessCardStyle}
          onClick={() => navigate('/pagos')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={accessIconContainerStyle('#fef3c7')}>
            <DollarSign size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div style={accessContentStyle}>
            <h3 style={accessTitleStyle}>Pagos</h3>
            <p style={accessDescriptionStyle}>Registrar y consultar pagos</p>
          </div>
        </div>

        {/* Inscripciones */}
        <div
          style={accessCardStyle}
          onClick={() => navigate('/inscripciones')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={accessIconContainerStyle('#e0e7ff')}>
            <FileText size={24} style={{ color: '#6366f1' }} />
          </div>
          <div style={accessContentStyle}>
            <h3 style={accessTitleStyle}>Inscripciones</h3>
            <p style={accessDescriptionStyle}>Inscribir alumnos a cursos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
