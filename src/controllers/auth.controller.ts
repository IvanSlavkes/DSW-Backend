import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: { ...parsed, password: hashedPassword },
    });

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const validPassword = await bcrypt.compare(parsed.password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ mensaje: "Login exitoso", token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
