# API REST (contrato actual)

Base local: `http://localhost:3000`. Los cuerpos y respuestas son JSON salvo respuestas `204 No Content`.

## Autenticación

`POST /auth/register` y `POST /auth/login` son públicos. El login devuelve un JWT. Para las rutas protegidas enviar:

```http
Authorization: Bearer <token>
```

`/localities` y `GET /` no requieren token. El resto de los recursos requiere un token válido. El middleware incorpora `id` y `role` en el payload, pero actualmente las rutas no autorizan operaciones según el rol.

## Rutas

| Recurso | Operaciones | Acceso | Notas |
| --- | --- | --- | --- |
| `/auth` | `POST /register`, `POST /login` | Público | Registro e inicio de sesión. |
| `/localities` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Público | La creación consulta GeoRef por nombre. |
| `/users` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Además, `GET /me` y `PUT /me` operan sobre el usuario del token. |
| `/fields` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Canchas relacionadas con localidad. |
| `/matches` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | El GET incluye cancha, creador, equipos y lugares. |
| `/match-teams` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Recurso CRUD de equipos. |
| `/team-positions` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | CRUD de lugares; no gestiona solicitudes para unirse. |
| `/friend-requests` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Solicitudes de amistad. |
| `/notifications` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Crear notificación también intenta enviar un email. |
| `/ratings` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Token | Tiene unicidad de rating por partido, autor y usuario calificado. |

## Autenticación y usuarios

### `POST /auth/register`

Campos validados: `name`, `lastName`, `email`, `password`, `position`, `birthDate`. La contraseña requiere al menos seis caracteres y se guarda con bcrypt. Devuelve `201` y `{ mensaje, user }`.

### `POST /auth/login`

Entrada: `{ "email": "...", "password": "..." }`. Devuelve `200` con `{ mensaje, token }`; credenciales inválidas devuelven `400`.

`GET /users/me` devuelve campos explícitos del perfil autenticado. El CRUD general de usuarios devuelve modelos Prisma directamente; revisar sus selecciones de campos antes de exponerlo a clientes, ya que actualmente puede incluir el hash de contraseña.

## Partidos

### `GET /matches` y `GET /matches/:id`

El listado y el detalle cargan relaciones de cancha, creador, ratings, notificaciones, equipos y lugares. El detalle inexistente devuelve `404`.

### `POST /matches`

La identidad del creador sale del JWT, no del body. Campos aceptados:

| Campo | Requisito |
| --- | --- |
| `name` | Texto no vacío. |
| `description` | Texto opcional. |
| `date` | Fecha que `Date` pueda parsear; la interfaz envía `YYYY-MM-DD`. |
| `time` | Hora `HH:MM`. |
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
  "date": "2026-11-05",
  "time": "20:30",
  "duration": 60,
  "privacy": "public",
  "fieldId": 1,
  "teamAName": "Los Tigres",
  "positionType": "delantero",
  "secondaryPositionType": "centrocampista"
}
```

Devuelve `201` con el partido, los dos equipos y sus lugares. Genera `N` lugares por equipo a partir de `Field.type` (`5`, `7` o `11`); el primer lugar del Equipo A se crea ocupado por el usuario autenticado y como capitán. Los demás quedan libres y sin posición. Errores documentados: `400` para validación/formato de cancha, `404` para cancha inexistente, `401/403` por autenticación y `500` ante otros errores.

### `PUT /matches/:id` y `DELETE /matches/:id`

La actualización admite parcialmente nombre, descripción, fecha, hora, duración, privacidad y estado; no cambia la cancha ni los equipos. El borrado exitoso devuelve `204`.

## Canchas y equipos

`POST /fields` acepta `name`, `address`, `type`, `localityId` y `price` opcional no negativo. `PUT /fields/:id` acepta un subconjunto de esos campos. El formato se guarda como texto; la creación del partido solo admite `5`, `7` u `11`.

`POST /match-teams` acepta `{ name, color, matchId }`; `PUT` permite `name` y `color`.

`POST /team-positions` acepta `matchTeamId` y los campos opcionales `positionType`, `secondaryPositionType`, `guestName`, `occupantId` y `role`. `PUT` actualiza datos del lugar. Este CRUD todavía no valida los enums ni aplica reglas de unión.

## Otros recursos

- `POST /friend-requests`: `requesterId`, `receiverId` y `status`.
- `POST /notifications`: `userId`, `type`, `message` y `matchId` opcional. `PUT` permite `read` y `message`.
- `POST /ratings`: `matchId`, `raterId`, `ratedId`, `stars` y `comment`. Una repetición de la combinación única devuelve `409`.
- `POST /localities`: `{ "nombre": "..." }`; consulta GeoRef y guarda la primera coincidencia. `PUT` permite actualizar `nombre`.

## Convenciones pendientes

Los recursos heredados no comparten todavía validación Zod ni una forma uniforme de error; pueden responder con `error`, `message`, `mensaje` o `errores`. `PositionRequest` existe en el modelo, pero no tiene endpoints. La documentación es una referencia del código actual y debe evolucionar con los contratos.
