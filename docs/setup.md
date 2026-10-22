# Instalación y ejecución del backend

## Requisitos

- Node.js y npm compatibles con las dependencias indicadas en `package.json`.
- Una instancia PostgreSQL persistente y accesible por red. Las pautas del TP no admiten una base embebida ni requieren que la base se ejecute localmente.
- Acceso a los repositorios frontend y backend.

## Configuración

Desde la raíz de `DSW-Backend`:

```powershell
npm install
Copy-Item .env.example .env
```

Completar `.env` con la conexión PostgreSQL y un secreto JWT privado. No subir `.env` ni credenciales al repositorio.

- `DATABASE_URL`: conexión que usa la configuración de Prisma CLI.
- `DIRECT_URL`: conexión que usa Prisma Client en ejecución (`src/lib/prisma.ts`).
- `JWT_SECRET`: secreto con el que se firman y validan tokens. El código conserva actualmente un valor de fallback para desarrollo; configurar uno propio evita usarlo.
- `PORT`: opcional; el servidor usa `3000` si no se especifica.
- `EMAIL_USER` y `EMAIL_PASS`: opcionales para el envío de correo desde el servicio de notificaciones.

En proveedores que entregan una URL pooled y otra directa, asignar cada URL según la configuración del proveedor. Si no hay diferencia, ambas pueden apuntar a la misma base PostgreSQL.

## Prisma y base de datos

```powershell
npx prisma generate
npx prisma migrate deploy
```

`migrate deploy` aplica las migraciones pendientes a la base indicada por la configuración. Verificar las URLs antes de ejecutarlo en cada entorno. Para revisar el estado:

```powershell
npx prisma migrate status
```

## Ejecutar

```powershell
npm run dev
```

El servidor usa `http://localhost:3000` por defecto. `npm run seed:localities` ejecuta el script de carga de localidades cuando sea necesario.

## Scripts disponibles

| Comando | Uso |
| --- | --- |
| `npm run dev` | Ejecuta Express con recarga mediante `tsx watch`. |
| `npm run seed:localities` | Carga localidades desde el servicio GeoRef. |
| `npm test` | Actualmente es un placeholder que termina con error; todavía no hay suite automatizada configurada. |

## Conectar el frontend

El cliente Axios del frontend está configurado actualmente en `src/api/client.ts` con `http://localhost:3000`. Aunque el repositorio frontend tiene una variable `VITE_API_URL`, el cliente aún no la consume. Para desarrollo local, iniciar el backend en el puerto predeterminado.
