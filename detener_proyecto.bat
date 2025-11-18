@echo off
title Deteniendo Proyecto

echo ========================================
echo   DETENIENDO PROYECTO ESCUELA
echo ========================================
echo.

echo Cerrando procesos de Node.js (Frontend)...
taskkill /F /IM node.exe /T 2>nul

echo Cerrando procesos de Python (Backend)...
taskkill /F /IM python.exe /T 2>nul

echo.
echo ========================================
echo   PROYECTO DETENIDO
echo ========================================
echo.
pause
```

---

## 🎨 Bonus Extra: Acceso directo con icono

### **Paso 1: Crear acceso directo**
1. Click derecho en `INICIAR_PROYECTO.bat`
2. Crear acceso directo
3. Mover el acceso directo al escritorio o donde prefieras

### **Paso 2: Cambiar icono (opcional)**
1. Click derecho en el acceso directo → Propiedades
2. Click en "Cambiar icono"
3. Elige un icono que te guste

---

## 📁 Estructura final recomendada
```
api_escuela 2.0/
├── INICIAR_PROYECTO.bat       ← Doble click para iniciar
├── DETENER_PROYECTO.bat       ← Doble click para detener
├── MarianoEsc/                ← Backend
└── React/                     ← Frontend