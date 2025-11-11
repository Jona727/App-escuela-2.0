import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.firstName || "Usuario";
  const userType = user.type || "Alumno";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mainStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #eff6ff, #f5f3ff)',
    padding: isMobile ? '20px' : '40px',
    fontFamily: 'Arial, sans-serif',
  };

  const welcomeCard: React.CSSProperties = {
    background: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    marginBottom: '40px',
  };

  const welcomeTop: React.CSSProperties = {
    background: 'linear-gradient(to right,rgb(41, 175, 155),rgb(51, 201, 234),rgb(13, 93, 150))',
    color: 'white',
    padding: isMobile ? '24px' : '40px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'center' : 'center',
    textAlign: isMobile ? 'center' : 'left',
    gap: isMobile ? '20px' : '0',
  };

  const welcomeText: React.CSSProperties = {
    maxWidth: isMobile ? '100%' : '60%',
  };

  const profileCircle: React.CSSProperties = {
    width: isMobile ? '60px' : '80px',
    height: isMobile ? '60px' : '80px',
    borderRadius: '9999px',
    background: 'linear-gradient(to right,rgb(138, 161, 42),rgb(98, 213, 69))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: isMobile ? '20px' : '24px',
  };

  const welcomeBottom: React.CSSProperties = {
    padding: isMobile ? '24px' : '40px',
    background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
    display: 'flex',
    justifyContent: 'center',
  };

  const illustrationBox: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    height: '200px',
    background: 'linear-gradient(to bottom right, #e0e7ff, #ede9fe)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const iconSmall: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '9999px',
    background: 'linear-gradient(to right, #6366f1, #9333ea)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  };

  const motivationCard: React.CSSProperties = {
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(6px)',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
  };

  const gradientText: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const motivationText: React.CSSProperties = {
    fontSize: isMobile ? '16px' : '18px',
    color: '#4b5563',
    maxWidth: '600px',
    margin: '0 auto',
  };

  return (
    <div style={mainStyle}>
      {/* Welcome Section */}
      <div style={welcomeCard}>
        <div style={welcomeTop}>
          <div style={welcomeText}>
            <h2 style={{ fontSize: isMobile ? '26px' : '32px', fontWeight: 'bold', marginBottom: '12px' }}>
              ¡Bienvenido, {userName}!
            </h2>
            <p style={{ fontSize: isMobile ? '18px' : '20px', opacity: 0.9, marginBottom: '10px' }}>
              Tipo de usuario: {userType}
            </p>
            <p style={{ fontSize: isMobile ? '14px' : '16px', opacity: 0.8 }}>
              Accede a todas las funcionalidades de gestión desde el menú de navegación.
            </p>
          </div>
          <div>
            <div style={profileCircle}>
              <GraduationCap size={isMobile ? 30 : 40} color="white" />
            </div>
          </div>
        </div>

        {/* Ilustración */}
        <div style={welcomeBottom}>
          <div style={illustrationBox}>
            <div style={iconSmall}>
              <GraduationCap size={30} color="white" />
            </div>
            <p style={{ color: '#6b7280', fontWeight: 500, fontSize: isMobile ? '14px' : '16px' }}>
              Sistema de Gestión Educativa
            </p>
          </div>
        </div>
      </div>

      {/* Motivational Section */}
      <div style={motivationCard}>
        <h3 style={gradientText}>Tu centro de control educativo</h3>
        <p style={motivationText}>
          Utiliza el menú de navegación para acceder a todas las herramientas y funcionalidades
          que necesitas para administrar eficientemente tu institución educativa.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
