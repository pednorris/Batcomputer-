@echo off
setlocal
color 09
title BatComputer - Instalacao Suprema

echo ===================================================
echo               BAT-AGENT SUPREME
echo ===================================================
echo.
echo [1] Verificando dependencias essenciais...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Baixe e instale o Node.js em: https://nodejs.org/
    pause
    exit /b
)

echo [2] Preparando ponte nativa do Windows...
cd /d "%~dp0bat-agent"
call npm install --silent >nul 2>&1

echo [3] Criando inicializador silencioso...
echo Set WshShell = CreateObject("WScript.Shell") > run_hidden.vbs
echo WshShell.Run "cmd.exe /c node server.js", 0, False >> run_hidden.vbs

echo [4] Configurando para iniciar com o Windows...
set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_PATH=%STARTUP_DIR%\BatAgentSupreme.vbs
copy /Y run_hidden.vbs "%SHORTCUT_PATH%" >nul 2>&1

echo [5] Inicializando agente em background agora...
start wscript run_hidden.vbs

echo.
echo ===================================================
echo   [ SUCESSO ] SEU WINDOWS AGORA TARA CONECTADO!
echo ===================================================
echo.
echo O BatAgent foi instalado. A janela do servidor agora e INVISIVEL.
echo Ele tambem ira iniciar automaticamente toda vez que ligar o PC.
echo.
echo Va no painel web BatComputer e veja as luzes ficarem ONLINE!
echo.
pause
