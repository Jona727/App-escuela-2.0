import React, { useEffect, useState } from 'react';
import { BookOpen, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  career: string;
  total_materias: number;
  materias_aprobadas: number;
}

interface Payment {
  id: number;
  amount: number;
  month: string;
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.firstname || user.firstName || "Usuario";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [course, setCourse] = useState<Course | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del curso
        const courseRes = await fetch(`http://localhost:8000/asignaciones/me/${user.username}`);
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourse(courseData.course || null);
        }

        // Obtener últimos pagos
        const paymentsRes = await fetch(`http://localhost:8000/payment/${user.username}`);
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          setPayments(paymentsData.payments?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.username) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user.username]);

  // Calcular progreso académico
  const progress = course && course.total_materias > 0
    ? Math.round((course.materias_aprobadas / course.total_materias) * 100)
    : 0;

  // Obtener próximo pago (el más reciente)
  const nextPayment = payments[0];

  // Estilos compactos y profesionales
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
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

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
  };

  const cardsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const iconContainerStyle = (color: string): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.4',
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
    gap: '8px',
    padding: '12px',
    background: '#fafafa',
    borderRadius: '8px',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280',
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header compacto */}
      <div style={headerStyle}>
        <p style={greetingStyle}>Bienvenido de nuevo,</p>
        <h1 style={userNameStyle}>{userName}</h1>
        <p style={subtitleStyle}>
          Mantente al día con tu actividad académica
        </p>
      </div>

      {/* Acceso Rápido */}
      <h2 style={sectionTitleStyle}>Acceso Rápido</h2>
      <div style={cardsGridStyle}>
        {/* Mi Cursada */}
        <div
          style={cardStyle}
          onClick={() => navigate('/MiCursada')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle('#dcfce7')}>
            <BookOpen size={20} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={cardTitleStyle}>Mi Cursada</h3>
            <p style={cardDescriptionStyle}>
              {course ? `${course.career} - ${course.total_materias} materias` : 'Accede a tus materias y progreso'}
            </p>
          </div>
          {course && (
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Progreso</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>{progress}%</span>
              </div>
              <div style={progressBarBackgroundStyle}>
                <div style={progressBarFillStyle(progress)}></div>
              </div>
            </div>
          )}
        </div>

        {/* Mis Pagos */}
        <div
          style={cardStyle}
          onClick={() => navigate('/MisPagos')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle('#dbeafe')}>
            <CreditCard size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 style={cardTitleStyle}>Mis Pagos</h3>
            <p style={cardDescriptionStyle}>
              {payments.length > 0 ? 'Revisa tu historial de pagos' : 'No hay pagos registrados'}
            </p>
          </div>
          {nextPayment && (
            <div style={statItemStyle}>
              <Calendar size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Último pago</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  ${nextPayment.amount.toLocaleString()} - {nextPayment.month}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mi Perfil */}
        <div
          style={cardStyle}
          onClick={() => navigate('/profile')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={iconContainerStyle('#fef3c7')}>
            <AlertCircle size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h3 style={cardTitleStyle}>Mi Perfil</h3>
            <p style={cardDescriptionStyle}>
              Gestiona tu información personal y seguridad
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
