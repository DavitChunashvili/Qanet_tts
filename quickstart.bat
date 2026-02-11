@echo off
REM Quick Start Script for QANet TTS PWA
REM This script helps you get started with development

echo.
echo ===================================
echo   QANet TTS PWA - Quick Start
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo [✓] npm found
npm --version
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [✓] Frontend dependencies installed
cd ..

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo [✓] Backend dependencies installed
cd ..

echo.
echo ===================================
echo   Installation Complete!
echo ===================================
echo.
echo Next steps:
echo.
echo 1. Open TWO terminal windows:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm run dev
echo.
echo 2. Open http://localhost:5173 in your browser
echo.
echo 3. For iPhone testing:
echo    - Find your computer IP: ipconfig
echo    - On iPhone Safari: http://192.168.X.X:5173
echo.
echo 4. Add to Home Screen:
echo    - Tap Share (^) menu on iPhone
echo    - Select "Add to Home Screen"
echo    - Tap "Add"
echo.
echo For detailed instructions, see SETUP.md or IMPLEMENTATION.md
echo.
pause
