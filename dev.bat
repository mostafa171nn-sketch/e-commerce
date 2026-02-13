@echo off
echo ==========================================
echo  Ecommerce App - Development Server
echo ==========================================
echo.

echo [1/3] Killing old Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Waiting for port 3000 to be released...
timeout /t 3 /nobreak >nul

echo [3/3] Starting Next.js on port 3000...
echo.
echo ==========================================
echo  Server will be available at:
echo  http://localhost:3000
echo ==========================================
echo.

start http://localhost:3000
npm run dev -- --port 3000
