@echo off
setlocal
cd /d "%~dp0"
title Sanad - Jiran Connect

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found on PATH.
  echo Install it from https://nodejs.org and double-click this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run: installing dependencies. This happens only once and takes a few minutes...
  call npm install
  if errorlevel 1 goto fail
)

rem Open the browser a few seconds after the dev server starts.
start "" /min cmd /c "timeout /t 10 >nul & start http://localhost:4321"

echo.
echo Starting Sanad - Jiran Connect at http://localhost:4321
echo Keep this window open while you use the app.
echo Close this window (or press Ctrl+C) to stop it.
echo.
call npm run dev -- --port 4321

echo.
echo The app has stopped.
pause
exit /b 0

:fail
echo.
echo Something went wrong above.
pause
exit /b 1
