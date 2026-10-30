# Instalación, configuración y ejecución del backend

## Requisitos

- Node.js y npm compatibles con el proyecto (recomendado: Node.js 20.19 o superior, o 22.12 o superior).
- PostgreSQL persistente accesible por red. El proyecto usa Neon en el entorno compartido; no requiere ejecutar PostgreSQL localmente.

## Instalar dependencias y configurar variables

Desde la raíz de `DSW-Backend`:

```powershell
npm install
Copy-Item .env.example .env
```

Editar `.env` con los valores privados del entorno. No subir `.env`, contraseñas ni cadenas de conexión al repositorio. Para que otros integrantes usen la misma base Neon, compartir los valores de forma privada; cada integrante crea su propio archivo `.env` local.

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión que usa Prisma Client durante las peticiones. En Neon, usar la URL pooled (host con `-pooler`). |
| `DIRECT_URL` | Conexión directa usada por Prisma CLI y migraciones. En Neon, usar la URL sin `-pooler`. |
| `JWT_SECRET` | Secreto privado que firma los tokens de sesión. Configurar un valor propio y seguro. |
| `PORT` | Puerto HTTP opcional; por defecto `3000`. |
| `EMAIL_USER`, `EMAIL_PASS` | Credenciales opcionales para el envío de correo. |

La configuración del cliente usa `DATABASE_URL` y admite `DIRECT_URL` como fallback. Para Neon se recomienda definir ambas.

## Generar Prisma y aplicar migraciones

Verificar que `.env` apunta al entorno correcto antes de ejecutar comandos de base de datos:

```powershell
npx prisma generate
npx prisma migrate deploy
npx prisma migrate status
```

`migrate deploy` aplica a la base configurada las migraciones pendientes del directorio `prisma/migrations`.

## Iniciar la API

```powershell
npm run dev
```

El servidor escucha en `http://localhost:3000` por defecto. `GET /` devuelve un mensaje de comprobación. Al arrancar, también revisa los recordatorios de partidos próximos y luego repite esa revisión cada 15 minutos.

## Scripts disponibles

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia Express con recarga de desarrollo mediante `tsx watch`. |
| `npm run seed:localities` | Importa localidades del departamento Rosario desde GeoRef; omite las ya cargadas. |
| `npm run create:admin -- <correo> <contraseña>` | Crea una cuenta administradora o da rol admin a una cuenta existente. |

## Integración con el frontend

El frontend se comunica con la API en `http://localhost:3000` por defecto. Cuando `VITE_API_URL` está vacío, el servidor Vite en `DSW-Frontend` reenvía las rutas de API al backend local. Para la presentación móvil se puede iniciar todo desde frontend con `npm run presentacion`; ver la [guía del frontend](https://github.com/IvanSlavkes/DSW-Frontend/blob/main/docs/setup.md).
