import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "../schemas/user.schema.js";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Listar usuarios
export async function listUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error en listUsers:", error);
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// Obtener usuario por ID
export async function getUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error en getUserHandler:", error);
    return res.status(500).json({ error: "Error al obtener usuario" });
  }
}

// Crear usuario
export async function createUserHandler(req: Request, res: Response) {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errores: result.error.issues });
  }

  try {
    // Validar localidad
    const locality = await prisma.locality.findUnique({
      where: { id: result.data.localityId },
    });
    if (!locality) {
      return res.status(404).json({ error: "Localidad no encontrada" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const nuevoUser = await createUser({
      ...result.data,
      password: hashedPassword,
    });

    return res.status(201).json(nuevoUser);
  } catch (error) {
    console.error("Error en createUserHandler:", error);
    return res.status(500).json({ error: "Error al crear usuario" });
  }
}

// Actualizar usuario
export async function updateUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = userSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errores: result.error.issues });
  }

  try {
    let dataToUpdate = result.data;

    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    if (dataToUpdate.localityId) {
      const locality = await prisma.locality.findUnique({
        where: { id: dataToUpdate.localityId },
      });
      if (!locality) {
        return res.status(404).json({ error: "Localidad no encontrada" });
      }
    }

    const userActualizado = await updateUser(id, dataToUpdate);
    return res.status(200).json(userActualizado);
  } catch (error) {
    console.error("Error en updateUserHandler:", error);
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
}

// Eliminar usuario
export async function deleteUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error en deleteUserHandler:", error);
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
}

// Login con JWT
export async function loginUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT con id y role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Devolver también datos básicos del usuario
    return res.status(200).json({
      mensaje: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error en loginUserHandler:", error);
    return res.status(500).json({ error: "Error en el login" });
  }
}

