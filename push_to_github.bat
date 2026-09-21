@echo off
title Push Student Performance Tracker to GitHub
cd /d "%~dp0"
echo ============================================================
echo   Pushing AI-Powered Student Performance Tracker to GitHub
echo   Repository: https://github.com/sachin8891/Student-Performance-System-
echo ============================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
) else (
    echo [ERROR] Push failed. If prompted, please sign in with your GitHub account.
)
pause
