# Modelo de datos

El esquema vigente está definido en [`prisma/schema.prisma`](../prisma/schema.prisma) y se persiste en PostgreSQL mediante Prisma.

## Entidades principales

| Entidad | Responsabilidad y relaciones principales |
| --- | --- |
| `User` | Perfil y cuenta. Puede crear partidos, ocupar lugares, recibir notificaciones y ratings, y enviar solicitudes. El rol se guarda como texto (`user`, `moderator`, `admin`). |
| `Field` | Cancha, dirección, formato (`5`, `7` o `11`), precio total y localidad. |
| `Match` | Partido con creador, cancha, fecha, hora, duración, privacidad y estado. |
| `MatchTeam` | Equipo asociado a un partido. La creación actual genera dos equipos. |
| `TeamPosition` | Lugar de un equipo. `positionType` y `secondaryPositionType` son opcionales; los valores de posición usados por el formulario son `arquero`, `defensor`, `centrocampista` y `delantero`. `status` contempla `free` y `occupied`; `role`, `player` y `captain`. |
| `PositionRequest` | Solicitud de un usuario para un equipo, con estado `pending`, `accepted` o `rejected`. La tabla ya existe, pero el flujo HTTP de solicitudes todavía no está implementado. |
| `Locality` | Localidad relacionada con usuarios y canchas. |
| `FriendRequest`, `Notification`, `Rating` | Solicitudes de amistad, notificaciones y calificaciones asociadas a usuarios/partidos. |

## Capacidad por formato

Al crear un partido se usa el formato de la cancha para generar `N` lugares por equipo:

| Formato | Lugares por equipo | Lugares totales |
| --- | ---: | ---: |
| Fútbol 5 | 5 | 10 |
| Fútbol 7 | 7 | 14 |
| Fútbol 11 | 11 | 22 |

El primer lugar del Equipo A queda ocupado por el creador y con rol `captain`. Los demás lugares se crean libres y sin posiciones asignadas.

## Decisiones funcionales registradas

- Los partidos privados se muestran en el listado y requieren aprobación del creador para incorporar a un jugador.
- El usuario elegirá a cuál de los dos equipos solicitar unirse.
- Cada usuario ocupará como máximo un lugar por partido y no podrá cambiar de equipo por ahora.
- La identidad del creador es `Match.creatorId`; el rol de capitán de `TeamPosition` no reemplaza la propiedad del partido.
- Se prevé mostrar el detalle en un modal con ambos equipos en columnas, integrantes, posiciones y lugares libres. Esa interfaz todavía está pendiente.
