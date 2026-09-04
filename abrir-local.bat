@echo off
cd /d "%~dp0"
echo.
echo  acacode-site  ->  http://localhost:5500
echo  Ctrl+C para detener
echo.
start "" "http://localhost:5500"
python -m http.server 5500
