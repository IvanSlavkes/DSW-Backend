import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/jwt-secret.js";

interface JwtPayload {
  id: number;
  role?: string;
}

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded; // ahora TS sabe que tiene id
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}
