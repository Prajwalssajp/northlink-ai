@echo off
title NORTHLINK AI - Smart Logistics Command Platform
color 0b
echo =====================================================================
echo    NORTHLINK AI - Disaster Logistics & Accessibility Intelligence
echo    North Eastern Region (NER) Spatial Intelligence Platform
echo =====================================================================
echo.
cd /d "%~dp0"
echo Starting NorthLink AI Web Application on http://localhost:3000 ...
echo Press Ctrl+C at any time to stop the server.
echo.
npm run dev
pause
