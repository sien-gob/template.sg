@echo off
:: Script para crear la estructura de directorios (prepare-install.bat)

echo Creando estructura de directorios para instalación...

if exist "setup-template.sg" (
    echo Limpiando instalador anterior...
    rd /s /q "setup-template.sg"
)

:: Crear directorio principal de instalación
mkdir setup-template.sg

:: Copiar archivos necesarios del proyecto
echo Copiando archivos del proyecto...
xcopy /E /I /Y "dist" "setup-template.sg\dist\"
copy "pm2.config.js" "setup-template.sg\dist\"
copy "package.json" "setup-template.sg\dist\"
copy "package-lock.json" "setup-template.sg\dist\"
copy ".env.dev" "setup-template.sg\dist\"
copy ".env.prod" "setup-template.sg\dist\"
xcopy /E /I /Y "app" "setup-template.sg\app\"

:: Copiar el instalador
copy "installer.md" "setup-template.sg\"
copy "docker-command.md" "setup-template.sg\dist\"
copy "docker-compose.yml" "setup-template.sg\dist\"

echo Comenzando la compresión...

:: Definir la carpeta de destino
set DESTINO_ZIP="D:\Sistemas\pj\distribuciones\template.sg\setup-template.zip"

:: Asegurar que la carpeta de destino existe
if not exist "D:\Sistemas\pj\distribuciones\template.sg" (
    mkdir "D:\Sistemas\pj\distribuciones\template.sg"
)

:: Comprimir la carpeta en la ubicación deseada
"C:\Program Files\7-Zip\7z.exe" a -tzip %DESTINO_ZIP% "setup-template.sg\*"

echo Espere un momento por favor...

:: Esperar 20 segundos para asegurarse de que 7-Zip haya terminado
timeout /t 20 /nobreak >nul

:: Verificar si la compresión fue exitosa antes de eliminar la carpeta
if exist %DESTINO_ZIP% (
    echo Eliminando carpeta temporal...
    rd /s /q "setup-template.sg"
)

echo Instalador creado en %DESTINO_ZIP%
pause