<p align="center">
  <a href="#" target="blank"><img src="./sien.png" width="200" alt="Nest Logo" /></a>
  SIEN-GOB
</p>

---

## Instructivo para Usar un Proyecto NestJS como Plantilla

## Pasos para Cambiar el Nombre del Proyecto

1. Modifica el archivo `package.json`:

   - Cambia el campo `"name"` al nuevo nombre de tu proyecto.
   - Actualiza `"description"`, `"author"`, y otros metadatos según sea necesario.

2. Edita `nest-cli.json`:

   - Modifica el campo `"name"` si está presente.

3. Actualiza `.env` (si existe):

   - Revisa y cambia cualquier variable de entorno que contenga el nombre del proyecto.

4. Revisa `tsconfig.json` y `tsconfig.build.json`:

   - Actualiza cualquier ruta o nombre de proyecto si es necesario.

5. Actualiza `README.md`:

   - Cambia la documentación con el nuevo nombre y descripción del proyecto.

6. Modifica `main.ts`:
   - Si has personalizado el nombre de la aplicación en `NestFactory.create()`, actualízalo.

## Pasos Posteriores

Después de realizar estos cambios:

1. Ejecuta `npm install` para reinstalar las dependencias.
2. Inicia el proyecto con `npm run start` para verificar que todo funcione correctamente.

## Notas Adicionales

- Asegúrate de revisar cualquier otro archivo de configuración específico de tu proyecto que pueda contener el nombre antiguo.
- Si estás usando un sistema de control de versiones como Git, considera hacer un commit con estos cambios para tener un punto de partida limpio para tu nuevo proyecto.
