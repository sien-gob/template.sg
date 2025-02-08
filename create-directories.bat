@echo off

:: Verificar y crear la carpeta C:\data\db si no existe
if not exist "C:\data\db\sg\components" (
    mkdir "C:\data\db\sg\components"
    echo Carpeta C:\data\db\sg\components creada.
) else (
    echo Carpeta C:\data\db\sg\components ya existe.
)

echo Proceso de verificación y creación de carpetas completado.
pause
