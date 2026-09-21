@echo off
title AI-Powered Student Performance Tracker
echo ============================================================
echo   Starting AI-Powered Student Performance Tracker System
echo   Tech Stack: Python, Pandas, SQL, MySQL, Java, React.js, GenAI
echo ============================================================

set "PATH=C:\Users\HP\.tools\node;C:\Users\HP\.tools\jdk\bin;%PATH%"

echo.
echo [1/3] Initializing Relational Database...
python "%~dp0database\db_setup.py"

echo [2/3] Booting Java REST Backend & Python Analytics Engine...
start "" "C:\Users\HP\.tools\jdk\bin\java.exe" -cp "%~dp0backend-java\bin" com.tracker.JavaBackendApplication
start "" python "%~dp0analytics-python\app.py"

echo [3/3] Launching React Dashboard on http://localhost:3000 ...
cd /d "%~dp0frontend-react"
call "C:\Users\HP\.tools\node\npm.cmd" run dev
