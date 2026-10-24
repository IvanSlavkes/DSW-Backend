import type { Request, Response, NextFunction } from "express";

type AuthRequest = Request & { user?: { id: number; role?: string } };

export function getAuthUserId(req: Request) {
  return Number((req as AuthRequest).user?.id);
}

export function isAdmin(req: Request) {
  return (req as AuthRequest).user?.role === "admin";
}

// true si es el dueño del recurso o es admin
export function isOwnerOrAdmin(req: Request, ownerId: number) {
  return isAdmin(req) || getAuthUserId(req) === ownerId;
}

// middleware para rutas que solo puede usar el admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!isAdmin(req)) {
    return res.status(403).json({ mensaje: "Solo para administradores" });
  }
  next();
}