import { useState } from 'react';

function Footer() {
  const [isMobile] = useState(window.innerWidth <= 768);

  // Estilos - Versión compacta y profesional
  const footerStyle: React.CSSProperties = {
    background: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    padding: isMobile ? '20px 24px' : '24px 40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    width: '100%',
    marginTop: 'auto',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  };

  const copyrightStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: isMobile ? 'center' : 'left',
    margin: 0,
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={copyrightStyle}>
          © 2025 Instituto Mariano Moreno. Todos los derechos reservados.
        </p>
        <p style={copyrightStyle}>
          Desarrollado por Fabricio Martinez y Jonatan Ramirez
        </p>
      </div>
    </footer>
  );
}

export default Footer;
