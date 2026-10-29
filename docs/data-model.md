# Modelo de datos

El esquema vigente está definido en [prisma/schema.prisma](../prisma/schema.prisma) y se persiste en PostgreSQL mediante Prisma.

## Entidades principales

| Entidad | Responsabilidad y relaciones |
| --- | --- |
| User | Cuenta y perfil. Puede crear partidos, ocupar posiciones, generar solicitudes de participación, recibir notificaciones y participar en calificaciones. Roles observados: user, moderator, admin y disabled. |
| Locality | Catálogo de localidades relacionado con usuarios y canchas. |
| FieldCategory | Categoría de cancha con superficie y cantidad de jugadores por equipo. |
| Field | Cancha con dirección, precio, localidad y categoría. |
| Match | Partido asociado a una cancha y a su creador; guarda fecha y hora de inicio, duración, privacidad y estado. |
| MatchTeam | Equipo perteneciente a un partido. La creación de un partido crea dos equipos. |
| TeamPosition | Lugar dentro de un equipo; puede estar libre u ocupado, tener ocupante, posición y rol de jugador o capitán. |
| PositionRequest | Solicitud de un usuario para entrar en un equipo, con estado pending, accepted o rejected. El flujo está implementado. |
| FriendRequest | Solicitud de amistad entre usuarios. |
| Notification | Notificación de un usuario, opcionalmente vinculada a un partido. |
| Rating | Calificación de un usuario a otro asociada a un partido; una combinación de partido, autor y usuario calificado es única. |

## Relaciones principales

~~~mermaid
erDiagram
    LOCALITY ||--o{ USER : resides
    LOCALITY ||--o{ FIELD : contains
    FIELD_CATEGORY ||--o{ FIELD : classifies
    FIELD ||--o{ MATCH : hosts
    USER ||--o{ MATCH : creates
    MATCH ||--|{ MATCH_TEAM : has
    MATCH_TEAM ||--|{ TEAM_POSITION : contains
    USER o|--o{ TEAM_POSITION : occupies
    USER ||--o{ POSITION_REQUEST : sends
    MATCH_TEAM ||--o{ POSITION_REQUEST : receives
    USER ||--o{ NOTIFICATION : receives
    MATCH o|--o{ NOTIFICATION : references
    MATCH ||--o{ RATING : has
    USER ||--o{ RATING : rates
~~~

## Capacidad por categoría de cancha

La cantidad de lugares por equipo proviene de FieldCategory.playersPerTeam:

| Categoría | Lugares por equipo | Lugares totales |
| --- | ---: | ---: |
| Fútbol 5 | 5 | 10 |
| Fútbol 7 | 7 | 14 |
| Fútbol 11 | 11 | 22 |

Al crear un partido se generan ambos equipos y sus lugares. El primer puesto del Equipo A queda ocupado por el creador y tiene rol de capitán; el resto comienza libre.

## Participación

En partidos públicos, un jugador ocupa un lugar libre inmediatamente. En partidos privados se registra una solicitud que el creador acepta o rechaza. La propiedad del partido se determina por Match.creatorId; el capitán es un atributo del lugar ocupado y no reemplaza al creador.
