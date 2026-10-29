# FUTGO — Backend

API REST de FUTGO, una aplicación web para encontrar y organizar partidos de fútbol. El backend está desarrollado con Node.js, TypeScript, Express, Prisma y PostgreSQL.

## Requisitos

- Node.js y npm; se recomienda Node.js 20.19 o superior, o 22.12 o superior.
- Una base PostgreSQL persistente y accesible por red. El entorno compartido usa Neon; no requiere iniciar una base local.

## Instalación y ejecución rápida

```powershell
npm install
Copy-Item .env.example .env
```

Completar `.env` con las conexiones PostgreSQL y un secreto JWT privado. Después:

```powershell
npx prisma generate
npx prisma migrate deploy
npm run dev
```

La API queda disponible en `http://localhost:3000`. La guía completa, incluidas las variables de entorno, está en [`docs/setup.md`](docs/setup.md).

## Repositorios y documentación

- [Frontend](https://github.com/IvanSlavkes/DSW-Frontend)
- [Documentación general y alcance de Regularidad](https://github.com/IvanSlavkes/DSW-Frontend/blob/main/docs/README.md)
- [Índice de documentación del backend](docs/README.md)
