# API REST (contrato actual)

Base local: `http://localhost:3000`. Los cuerpos y respuestas son JSON salvo respuestas `204 No Content`.

## Autenticación

`POST /auth/register` y `POST /auth/login` son públicos. El login devuelve un JWT. Para las rutas protegidas enviar:

```http
Authorization: Bearer <token>
```

`POST /auth/register`, `POST /auth/login`, `GET /`, `GET /localities` y `GET /localities/:id` son públicos. Las demás operaciones requieren token. Varias rutas también requieren rol `admin`; las rutas de perfil permiten al usuario operar sobre su propia cuenta.

## Rutas

| Recurso | Operaciones | Acceso | Notas |
| --- | --- | --- | --- |
| `/auth` | `POST /register`, `POST /login` | Público | Registro e inicio de sesión. |
| `/localities` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | GET público; escrituras admin | Las escrituras requieren token y administrador. |
| `/users` | CRUD más `GET /me` y `PUT /me` | Token; permisos por dueño/admin | Listar, crear y borrar requieren admin; el perfil permite consultar y editar los propios datos. |
| `/fields` | CRUD | Token; escrituras admin | Canchas relacionadas con localidad y categoría. |
| `/field-categories` | CRUD | Token; escrituras admin | Categorías con superficie y jugadores por equipo. |
| `/matches` | CRUD, `/mine`, `/join`, `/my-participation`, `/position-requests` | Token; solicitudes para el creador | El detalle incluye cancha, creador, equipos y lugares. Editar o borrar partidos requiere admin. |
| `/match-teams`, `/team-positions` | CRUD | Token; escrituras admin | Las inscripciones se gestionan mediante `/matches/:id/join`. |
| `/friend-requests` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Solicitudes de amistad. |
| `/notifications` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token; permisos de dueño/admin y admin para crear | Listar devuelve las notificaciones del usuario autenticado; el admin puede usar `?all=true`. |
| `/ratings` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Tiene unicidad de rating por partido, autor y usuario calificado. |

## Autenticación y usuarios

### `POST /auth/register`

Campos validados: `name`, `lastName`, `email`, `password`, `description` opcional, `position`, `secondaryPosition` opcional, `localityId` y `birthDate`. La persona debe tener 18 años o más según la fecha de Argentina; la contraseña requiere al menos seis caracteres y se guarda con bcrypt. Un correo duplicado devuelve `409`; el registro exitoso devuelve `201` y `{ mensaje, user }`.

### `POST /auth/login`

Entrada: `{ "email": "...", "password": "..." }`. Devuelve `200` con `{ mensaje, token }`; credenciales inválidas devuelven `400`. Una cuenta con rol `disabled` recibe `403` y `{ "error": "Usuario desactivado" }`. El token vence a los siete días.

`GET /users/me` y las operaciones generales de usuario excluyen el hash de contraseña. Para consultar o editar `/users/:id`, el token debe pertenecer al usuario indicado o a un administrador. Sólo el administrador puede cambiar roles.

## Partidos

### `GET /matches` y `GET /matches/:id`

El listado y el detalle cargan relaciones de cancha, creador, ratings, notificaciones, equipos y lugares. El detalle inexistente devuelve `404`.

### Inscripción y solicitudes de lugar

- `POST /matches/:id/join` acepta `{ "teamId": 1, "positionType": "centrocampista", "secondaryPositionType": null }`. Los campos de posición se envían como una posición válida o `null`. En partidos públicos ocupa un lugar libre inmediatamente; en partidos privados crea una solicitud `pending` que no reserva cupo. Requiere autenticación.
- `GET /matches/:id/my-participation` devuelve si el usuario es creador, su lugar ocupado y su solicitud más reciente en ese partido.
- `GET /matches/:id/position-requests` lista solicitudes pendientes y solo la puede consultar el creador.
- `PATCH /matches/:id/position-requests/:requestId` acepta `{ "decision": "accepted" }` o `{ "decision": "rejected" }` y solo lo puede ejecutar el creador. Aceptar asigna un lugar libre; si el equipo ya está completo devuelve `409` y deja la solicitud pendiente.

La API devuelve `409` si el partido ya empezó, está lleno, el usuario ya está inscripto o existe una solicitud pendiente incompatible. Al ocupar el último cupo, el partido cambia a `full`.

### `POST /matches`

La identidad del creador sale del JWT, no del body. Campos aceptados:

| Campo | Requisito |
| --- | --- |
| `name` | Texto no vacío. |
| `description` | Texto opcional. |
| `startsAt` | Fecha y hora ISO 8601 con zona horaria; la interfaz arma el valor a partir de la fecha y la hora seleccionadas. |
| `duration` | Entero positivo opcional; Prisma usa 60 si se omite. |
| `privacy` | `public` o `private`. |
| `fieldId` | Entero positivo de una cancha existente. |
| `teamAName` | Texto no vacío de hasta 50 caracteres. |
| `positionType` | Opcional: `arquero`, `defensor`, `centrocampista` o `delantero`. |
| `secondaryPositionType` | Opcional; acepta los mismos valores. |

Los campos desconocidos se descartan por el esquema Zod; por eso un `creatorId` agregado al body no cambia el usuario autenticado.

Ejemplo:

```json
{
  "name": "Fútbol del jueves",
  "description": "Partido amistoso",
  "startsAt": "2026-11-05T20:30:00-03:00",
  "duration": 60,
  "privacy": "public",
  "fieldId": 1,
  "teamAName": "Los Tigres",
  "positionType": "delantero",
  "secondaryPositionType": "centrocampista"
}
```

Devuelve `201` con el partido, los dos equipos y sus lugares. Genera `N` lugares por equipo a partir de `FieldCategory.playersPerTeam` (`5`, `7` o `11`); el primer lugar del Equipo A se crea ocupado por el usuario autenticado y como capitán. Los demás quedan libres y sin posición. Errores documentados: `400` para validación/formato de cancha, `404` para cancha inexistente, `401/403` por autenticación/autorización y `500` ante otros errores.

### `PUT /matches/:id` y `DELETE /matches/:id`

La actualización admite parcialmente nombre, descripción, fecha, hora, duración, privacidad y estado; no cambia la cancha ni los equipos. El borrado exitoso devuelve `204`.

## Canchas y equipos

`POST /fields` acepta `name`, `address`, `categoryId`, `localityId` y `price` opcional no negativo. Las escrituras requieren rol admin. El formato y la superficie se definen en `FieldCategory`; al crear un partido se admiten categorías con 5, 7 u 11 jugadores por equipo.

`POST /match-teams` acepta `{ name, color, matchId }`; `PUT` permite `name` y `color`.

`POST /team-positions` acepta `matchTeamId` y los campos opcionales `positionType`, `secondaryPositionType`, `guestName`, `occupantId` y `role`. `PUT` actualiza datos del lugar. Estos cambios requieren rol de administrador; las inscripciones de jugadores deben usar `POST /matches/:id/join`.

## Otros recursos

- `POST /friend-requests`: `requesterId`, `receiverId` y `status`.
- `POST /notifications`: `userId`, `type`, `message` y `matchId` opcional. `PUT` permite `read` y `message`.
- `POST /ratings`: `matchId`, `raterId`, `ratedId`, `stars` y `comment`. Una repetición de la combinación única devuelve `409`.
- `POST /localities`: `{ "nombre": "..." }`; requiere token de administrador, consulta GeoRef y guarda la primera coincidencia. `PUT` y `DELETE` también requieren admin.

## Convenciones pendientes

Los recursos heredados no comparten todavía validación Zod ni una forma uniforme de error; pueden responder con `error`, `message`, `mensaje` o `errores`. La documentación es una referencia del código actual y debe evolucionar con los contratos.
