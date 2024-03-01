@echo off
SETLOCAL

:: Determine the script's current directory
SET "scriptPath=%~dp0"

:: Navigate to the frontend directory and run commands
cd "%scriptPath%frontend"
call npm run build
start call npm start

:: Open a new command prompt window to start the backend server
start cmd /k "cd %scriptPath%backend && .\venv\Scripts\activate && flask run"

:: Return to the original script directory (optional)
cd "%scriptPath%"
ENDLOCAL
