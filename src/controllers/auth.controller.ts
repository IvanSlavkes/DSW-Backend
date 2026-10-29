import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/jwt-secret.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

// Convierte un error en un mensaje claro para el usuario.
// Nunca devuelve el texto interno de Prisma (trae rutas y detalles de la consulta).
function readableError(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join('. ');
  }
  if ((error as { code?: string })?.code === 'P2002') {
    return 'Ese correo ya está registrado. Probá iniciar sesión o usá otro correo.';
  }
  console.error(error);
  return fallback;
}

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: { ...parsed, password: hashedPassword },
    });

    const { password: _password, ...safeUser } = user;
    res
      .status(201)
      .json({ mensaje: 'Usuario registrado exitosamente', user: safeUser });
  } catch (error) {
    const isDuplicateEmail = (error as { code?: string })?.code === 'P2002';
    res
      .status(isDuplicateEmail ? 409 : 400)
      .json({ error: readableError(error, 'No se pudo registrar el usuario') });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    if (!user) return res.status(400).json({ error: 'Correo o contraseña incorrectos' });

    const validPassword = await bcrypt.compare(parsed.password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: 'Correo o contraseña incorrectos' });

    if (user.role === 'disabled') {
      return res.status(403).json({ error: 'Usuario desactivado' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    if ((error as { code?: string })?.code === 'P1017') {
      return res.status(503).json({
        error: 'La base de datos no está disponible. Intentá de nuevo más tarde.',
      });
    }
    res
      .status(400)
      .json({ error: readableError(error, 'No se pudo iniciar sesión') });
  }
};
