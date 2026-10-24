// Campos de un usuario que es seguro devolver al frontend (sin password ni email).
export const publicUserSelect = {
  id: true,
  name: true,
  lastName: true,
} as const;