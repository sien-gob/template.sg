@echo off
:: Script para crear la estructura de directorios (prepare-install.bat)

echo Creando estructura de directorios para instalación...

if exist "installer" (
    echo Limpiando instalador anterior...
    rd /s /q "installer"
)

:: Crear directorio principal de instalación
mkdir installer

:: Copiar archivos necesarios del proyecto
echo Copiando archivos del proyecto...
xcopy /E /I /Y "dist" "installer\dist\"
copy "pm2.config.js" "installer\dist\"
copy "package.json" "installer\dist\"
copy "package-lock.json" "installer\dist\"
copy ".env.dev" "installer\dist\"
copy ".env.prod" "installer\dist\"
xcopy /E /I /Y "app" "installer\app\"

:: Copiar el instalador
copy "installer.md" "installer\"

echo Estructura de directorios creada correctamente!
echo.
echo Ahora puedes distribuir la carpeta 'installer'
pause