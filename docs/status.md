# Estado funcional y pendientes

Este inventario es una lectura del código actual, no un registro de reuniones ni de asignación de tareas. Revisado el 22 de octubre de 2026.

## Implementado en el código

- Registro e inicio de sesión con JWT.
- API REST con recursos para usuarios, canchas, partidos, equipos, lugares, localidades, solicitudes de amistad, notificaciones y calificaciones.
- Creación de partidos con validación de datos y creación atómica de dos equipos y sus lugares.
- Tarjetas de partidos disponibles en `/matches` y en el Dashboard, con cancha, precio estimado por jugador, fecha/hora, duración, disponibilidad y creador.
- Formularios para crear partido, perfil, cancha y otros recursos administrativos.
- La API `GET /matches/:id` responde con datos relacionados para el detalle, aunque la interfaz todavía no la consulta desde la tarjeta.

## Acordado, pendiente de implementar

- Abrir un modal de detalle al elegir “Ver partido”, consultando el detalle del partido al backend y mostrando equipos enfrentados, jugadores, posiciones y lugares libres.
- Unirse o solicitar un lugar eligiendo Equipo A o Equipo B.
- En partidos privados, registrar la solicitud y permitir que el creador del partido la acepte o rechace.
- Impedir que un usuario ocupe más de un lugar en el mismo partido y que cambie de equipo.
- Actualizar el estado visual de la tarjeta y del modal según la participación o solicitud del usuario.
- Agregar filtros funcionales al listado; hoy permite ordenar por horario o precio, pero no filtrar por localidad, posición, formato, día u hora como plantea la propuesta desactualizada.

La tabla `PositionRequest` está creada en Prisma, pero no hay rutas ni servicios para enviar, listar o resolver esas solicitudes. El botón de unión de las tarjetas todavía es solo visual.

## Revisión del TP pendiente

- La propuesta del grupo está desactualizada y necesita reflejar el alcance vigente y ser revisada con los docentes.
- Mantener minutas y evidencias de coordinación queda a cargo del grupo.
- Registrar el seguimiento de features, bugs e issues en la herramienta grupal elegida; este archivo no lo reemplaza.
- La API no tiene documentación OpenAPI/Swagger todavía.
- El script de `npm test` es un placeholder. Para aprobación directa, el README del TP solicita pruebas automatizadas por integrante, una prueba de integración de backend, una prueba unitaria de frontend y una prueba end-to-end, además de evidencia.
- Aunque el JWT incluye `role`, las rutas protegidas actualmente verifican token y no hacen autorización diferenciada por rol.
- Algunas consultas devuelven el modelo `User` completo a través de relaciones CRUD; revisar y limitar los campos sensibles antes de una entrega pública.

## Observaciones técnicas para próximas iteraciones

- El frontend tiene `VITE_API_URL` en su entorno local, pero `src/api/client.ts` todavía fija la URL `http://localhost:3000`.
- La respuesta de algunos CRUD usa mensajes/campos de error en español y otros en inglés; conviene unificar el contrato API al documentar una versión estable.
- Revisar que las rutas generales de usuarios no expongan datos sensibles al cliente; `/users/me` sí selecciona campos explícitos, mientras que algunos CRUD devuelven directamente el modelo Prisma.
