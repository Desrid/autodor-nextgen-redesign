@echo off
setlocal
cd /d "%~dp0"
if not exist "%~dp0app\runtime\node.exe" (
  echo Please extract the entire ZIP archive before starting.
  echo The app folder must be next to START.cmd.
  pause
  exit /b 1
)
if not exist "%~dp0app\server.cjs" (
  echo The app folder is incomplete. Please extract the entire ZIP again.
  pause
  exit /b 1
)
"%~dp0app\runtime\node.exe" "%~dp0app\server.cjs"
if errorlevel 1 pause
