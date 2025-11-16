// Sistema de estilos compartidos para todas las vistas
// Diseño compacto, profesional y coherente

import { CSSProperties } from 'react';

// Función helper para determinar si es mobile
export const useIsMobile = () => window.innerWidth <= 768;

// Espaciado estandarizado (reducido ~50%)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

// Colores del sistema
export const colors = {
  // Grises
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Principal (verde)
  primary: '#10b981',
  primaryHover: '#059669',
  primaryLight: '#d1fae5',

  // Secundario (azul)
  secondary: '#3b82f6',
  secondaryHover: '#2563eb',
  secondaryLight: '#dbeafe',

  // Estados
  success: '#10b981',
  successBg: '#f0fdf4',
  successBorder: '#86efac',

  error: '#ef4444',
  errorBg: '#fef2f2',
  errorBorder: '#fca5a5',

  warning: '#f59e0b',
  warningBg: '#fffbeb',
  warningBorder: '#fcd34d',

  info: '#3b82f6',
  infoBg: '#eff6ff',
  infoBorder: '#93c5fd',
} as const;

// Tipografía estandarizada
export const typography = {
  // Títulos de página
  pageTitle: (isMobile: boolean): CSSProperties => ({
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.sm,
    letterSpacing: '-0.015em',
  }),

  // Subtítulos de página
  pageSubtitle: (isMobile: boolean): CSSProperties => ({
    fontSize: isMobile ? '13px' : '14px',
    color: colors.gray500,
    fontWeight: '400',
  }),

  // Títulos de sección
  sectionTitle: (): CSSProperties => ({
    fontSize: '18px',
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  }),

  // Labels
  label: (): CSSProperties => ({
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: colors.gray700,
    marginBottom: spacing.sm,
  }),

  // Texto de info
  infoLabel: (): CSSProperties => ({
    fontSize: '13px',
    color: colors.gray500,
    marginBottom: '4px',
  }),

  infoValue: (): CSSProperties => ({
    fontSize: '15px',
    fontWeight: '500',
    color: colors.gray900,
  }),
} as const;

// Contenedores
export const containers = {
  // Contenedor principal de página
  page: (isMobile: boolean): CSSProperties => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? spacing.lg : `${spacing.xl} 40px`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }),

  // Header de página
  pageHeader: (): CSSProperties => ({
    marginBottom: spacing.xl,
    borderBottom: `1px solid ${colors.gray200}`,
    paddingBottom: spacing.md,
  }),

  // Card genérica
  card: (isMobile: boolean): CSSProperties => ({
    background: '#ffffff',
    borderRadius: '12px',
    padding: isMobile ? spacing.lg : spacing.xl,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.gray200}`,
    marginBottom: spacing.lg,
  }),

  // Card compacta (para stats, etc)
  compactCard: (isMobile: boolean): CSSProperties => ({
    background: '#ffffff',
    borderRadius: '12px',
    padding: isMobile ? spacing.md : spacing.lg,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.gray200}`,
  }),
} as const;

// Inputs
export const inputs = {
  base: (): CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${colors.gray300}`,
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  }),

  focus: (element: HTMLElement) => {
    element.style.borderColor = colors.gray400;
    element.style.outline = 'none';
    element.style.boxShadow = `0 0 0 3px ${colors.gray100}`;
  },

  blur: (element: HTMLElement) => {
    element.style.borderColor = colors.gray300;
    element.style.boxShadow = 'none';
  },
} as const;

// Botones
export const buttons = {
  // Botón primario
  primary: (isLoading = false): CSSProperties => ({
    padding: '10px 20px',
    background: colors.primary,
    color: 'white',
    fontWeight: '500',
    borderRadius: '8px',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    fontFamily: 'inherit',
    opacity: isLoading ? 0.6 : 1,
  }),

  // Botón secundario
  secondary: (): CSSProperties => ({
    padding: '10px 20px',
    background: colors.secondary,
    color: 'white',
    fontWeight: '500',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    fontFamily: 'inherit',
  }),

  // Botón de peligro
  danger: (): CSSProperties => ({
    padding: '10px 20px',
    background: colors.error,
    color: 'white',
    fontWeight: '500',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    fontFamily: 'inherit',
  }),

  // Botón outline
  outline: (): CSSProperties => ({
    padding: '10px 20px',
    background: 'transparent',
    color: colors.gray700,
    fontWeight: '500',
    borderRadius: '8px',
    border: `1px solid ${colors.gray300}`,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    fontFamily: 'inherit',
  }),

  // Botón pequeño (para iconos)
  iconSmall: (): CSSProperties => ({
    padding: '6px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: colors.gray600,
  }),
} as const;

// Helpers para hover effects
export const hoverEffects = {
  primaryButton: (element: HTMLElement) => {
    element.style.background = colors.primaryHover;
  },

  secondaryButton: (element: HTMLElement) => {
    element.style.background = colors.secondaryHover;
  },

  dangerButton: (element: HTMLElement) => {
    element.style.background = '#dc2626';
  },

  outlineButton: (element: HTMLElement) => {
    element.style.background = colors.gray50;
    element.style.borderColor = colors.gray400;
  },

  iconButton: (element: HTMLElement) => {
    element.style.background = colors.gray100;
  },

  card: (element: HTMLElement) => {
    element.style.transform = 'translateY(-2px)';
    element.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  },

  reset: (element: HTMLElement, originalStyles: CSSProperties) => {
    Object.assign(element.style, originalStyles);
  },
} as const;

// Alerts
export const alerts = {
  success: (): CSSProperties => ({
    padding: '12px 16px',
    background: colors.successBg,
    color: '#166534',
    border: `1px solid ${colors.successBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: spacing.md,
  }),

  error: (): CSSProperties => ({
    padding: '12px 16px',
    background: colors.errorBg,
    color: '#991b1b',
    border: `1px solid ${colors.errorBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: spacing.md,
  }),

  warning: (): CSSProperties => ({
    padding: '12px 16px',
    background: colors.warningBg,
    color: '#92400e',
    border: `1px solid ${colors.warningBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: spacing.md,
  }),

  info: (): CSSProperties => ({
    padding: '12px 16px',
    background: colors.infoBg,
    color: '#1e40af',
    border: `1px solid ${colors.infoBorder}`,
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: spacing.md,
  }),
} as const;

// Badges
export const badges = {
  base: (color: 'primary' | 'secondary' | 'success' | 'error' | 'warning'): CSSProperties => {
    const colorMap = {
      primary: { bg: colors.primaryLight, text: '#065f46', border: '#86efac' },
      secondary: { bg: colors.secondaryLight, text: '#1e40af', border: '#93c5fd' },
      success: { bg: colors.successBg, text: '#166534', border: colors.successBorder },
      error: { bg: colors.errorBg, text: '#991b1b', border: colors.errorBorder },
      warning: { bg: colors.warningBg, text: '#92400e', border: colors.warningBorder },
    };

    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: colorMap[color].bg,
      color: colorMap[color].text,
      border: `1px solid ${colorMap[color].border}`,
    };
  },
} as const;

// Tablas
export const table = {
  container: (): CSSProperties => ({
    overflowX: 'auto',
    borderRadius: '8px',
    border: `1px solid ${colors.gray200}`,
  }),

  table: (): CSSProperties => ({
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  }),

  th: (): CSSProperties => ({
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: colors.gray700,
    background: colors.gray50,
    borderBottom: `2px solid ${colors.gray200}`,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }),

  td: (): CSSProperties => ({
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.gray200}`,
    color: colors.gray900,
  }),

  trHover: (): CSSProperties => ({
    background: colors.gray50,
  }),
} as const;

// Modales
export const modal = {
  overlay: (): CSSProperties => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing.lg,
  }),

  content: (isMobile: boolean): CSSProperties => ({
    background: '#ffffff',
    borderRadius: '12px',
    padding: isMobile ? spacing.lg : spacing.xl,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${colors.gray200}`,
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  }),

  closeButton: (): CSSProperties => ({
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: colors.gray500,
    fontSize: '24px',
    lineHeight: '1',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s',
  }),
} as const;

// Grid system
export const grid = {
  // Grid de 2 columnas
  cols2: (isMobile: boolean): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: spacing.lg,
  }),

  // Grid de 3 columnas
  cols3: (isMobile: boolean): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: spacing.lg,
  }),

  // Grid de 4 columnas
  cols4: (isMobile: boolean): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: spacing.lg,
  }),
} as const;

// Loading spinner
export const spinner = (): CSSProperties => ({
  width: '14px',
  height: '14px',
  border: '2px solid transparent',
  borderTop: '2px solid white',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
});

// Export todo junto
export default {
  spacing,
  colors,
  typography,
  containers,
  inputs,
  buttons,
  hoverEffects,
  alerts,
  badges,
  table,
  modal,
  grid,
  spinner,
};
