# Estado funcional del backend

Inventario contrastado con el código el 29 de octubre de 2026. No es un registro de reuniones ni de asignación de tareas.

## Funcionalidades implementadas

- Registro e inicio de sesión con JWT, hash de contraseña, validación de datos y rechazo de cuentas desactivadas.
- Recursos REST para usuarios, localidades, categorías de cancha, canchas, partidos, equipos, posiciones, solicitudes de participación, solicitudes de amistad, notificaciones y calificaciones.
- Creación de partidos en una transacción lógica que genera dos equipos y sus lugares de acuerdo con la categoría de cancha.
- Listado y consulta de partido con cancha, creador, equipos, lugares e integrantes.
- Inscripción directa a partidos públicos y solicitud con aprobación del creador para partidos privados.
- Consulta de partidos creados o en los que participa el usuario autenticado.
- Autorización de operaciones administrativas mediante el rol admin; consulta y edición del perfil propio.
- Cálculo de estadísticas del usuario a partir de sus calificaciones.
- Creación periódica de notificaciones para partidos próximos.

## Reglas de acceso relevantes

- La mayoría de los recursos de API requiere JWT.
- La creación, edición y eliminación de canchas y categorías, y varias operaciones de mantenimiento, requieren administrador.
- Los datos de perfil del usuario se editan mediante las rutas propias; el cambio de rol se reserva al administrador.
- El inicio de sesión rechaza al usuario cuyo rol es disabled.

## Seguimiento de Regularidad

- La propuesta actualizada debe indicar los CRUD, listados y casos de uso que el grupo presenta como alcance mínimo.
- La interfaz tiene un listado filtrable de partidos con detalle. El panel administrativo tiene un listado filtrable de usuarios/jugadores con información expandible; confirmar con la cátedra que ese alcance satisface el segundo listado de la propuesta.
- Los archivos disponibles no contienen minutas, tablero de seguimiento ni enlaces exactos a los PR de entrega. Deben incorporarse con información real del grupo; esta página no los sustituye.

Para instalar y ejecutar el servicio, consultar [setup.md](setup.md). Para revisar relaciones y entidades, consultar [data-model.md](data-model.md).
