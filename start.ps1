# NORTHLINK AI - PowerShell Startup Script
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   NORTHLINK AI - Smart Logistics & Accessibility Intelligence" -ForegroundColor White
Write-Host "   North Eastern Region (NER) Spatial Command Platform" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Set-Location -Path $PSScriptRoot
Write-Host "Launching NorthLink AI on http://localhost:3000 ..." -ForegroundColor Green
npm run dev
