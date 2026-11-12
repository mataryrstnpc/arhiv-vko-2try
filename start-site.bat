@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Сайт архива ВКО

where node >nul 2>nul
if errorlevel 1 goto nonode
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>20||(a===20&&b>=6)?0:1)"
if errorlevel 1 goto oldnode

node tools\launch.js
echo.
echo Сайт остановлен.
pause
exit /b

:nonode
echo Для запуска нужен Node.js. Пробую установить его автоматически...
where winget >nul 2>nul
if errorlevel 1 goto manual
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
echo.
echo Если установка прошла успешно, закройте это окно и снова запустите start-site.bat
pause
exit /b

:oldnode
echo Установлен слишком старый Node.js. Нужна версия 20.6 или новее.
:manual
echo Скачайте и установите Node.js (кнопка LTS), затем снова запустите start-site.bat
start "" https://nodejs.org/
pause
exit /b
