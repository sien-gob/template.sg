## Dev

1. Levantar los servicios de docker que se va a consumir

```bash

    # comandos de imagen especifica
    docker-compose up -d redis # crea imagen de redis
    docker-compose start redis # levanta el servicio
    docker-compose stop redis  # detener el servicio

    # todos
    docker-compose up -d
    docker-compose start
    docker-compose stop

    docker network rm core-network-sg  # Elimina la red existente

    # Listado de imagenes

    docker ps      # lista de imagenes corriendo
    docker images  # lista todas la imagenes del contenedor docker

    docker exec -it redis-se-sg redis-cli -p 6380 ping


    instalación pasos 

    1. Habilitar la característica de contenedores
        Install-WindowsFeature -Name Containers -Restart

    2. Habilitar Hyper-V (si usarás contenedores Linux)
        Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart

    3. Instalar el Subsistema de Windows para Linux (WSL2)
        wsl --install
       
        revisar:
        wsl --set-default-version 2

    4. instalar docker Desktop 
        
        revisar:
        docker version
        docker info

    5. Configurar Docker para iniciar con Windows
        New-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "DockerDesktop" -Value "C:\Program Files\Docker\Docker\Docker Desktop.exe" -PropertyType String
```
