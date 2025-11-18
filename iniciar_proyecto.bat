@echo off
title Proyecto Escuela Mariano Moreno

echo ========================================
echo   INICIANDO PROYECTO ESCUELA
echo ========================================
echo.

REM Colores
color 0A

REM Inicia Backend en una nueva ventana
echo [1/2] Iniciando Backend (FastAPI)...
start "Backend - FastAPI" cmd /k "cd /d "%~dp0MarianoEsc" && .\venv\Scripts\activate && uvicorn app:api_escu --reload"

REM Espera 3 segundos para que el backend inicie
timeout /t 3 /nobreak >nul

REM Inicia Frontend en otra ventana
echo [2/2] Iniciando Frontend (React + Vite)...
start "Frontend - React" cmd /k "cd /d "%~dp0React\React P2y3" && npm run dev"

echo.
echo ========================================
echo   PROYECTO INICIADO CORRECTAMENTE
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

REM Abre el navegador automáticamente
start http://localhost:5173

exit