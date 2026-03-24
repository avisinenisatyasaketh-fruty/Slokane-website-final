@echo off
title SlokaNE Website Launcher (MySQL)
color 0A
echo.
echo  =====================================================
echo   SlokaNE Website  ^|  React + MySQL Backend
echo  =====================================================
echo.
echo  IMPORTANT: Before starting, make sure:
echo    1. MySQL is running (XAMPP or MySQL Server)
echo    2. You ran schema.sql to create the database
echo    3. You updated backend\.env with your MySQL password
echo.
pause

echo  Installing Frontend packages...
cd frontend
call npm install
if %errorlevel% neq 0 ( echo [ERROR] Frontend install failed! & pause & exit /b 1 )
cd ..

echo  Installing Backend packages...
cd backend
call npm install
if %errorlevel% neq 0 ( echo [ERROR] Backend install failed! & pause & exit /b 1 )
cd ..

echo.
echo  Starting servers...
echo  Backend  API  -^>  http://localhost:3001
echo  Frontend App  -^>  http://localhost:5173
echo.

start "SlokaNE Backend (MySQL)" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "SlokaNE Frontend (React)" cmd /k "cd frontend && npm run dev"

echo  Both servers starting. Open http://localhost:5173
pause >nul
