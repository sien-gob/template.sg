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

    # Listado de imagenes

    docker ps      # lista de imagenes corriendo
    docker images  # lista todas la imagenes del contenedor docker
```

