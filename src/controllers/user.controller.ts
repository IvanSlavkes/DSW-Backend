import type { Request, Response } from "express";
import bcrypt from "bcrypt"; // para encriptar y comparar contraseñas
import { userSchema } from "../schemas/user.schema.js";
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../services/user.service.js";

// Listar todos los usuarios
export async function listUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
}

// Obtener un usuario por ID
export async function getUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
}

// Crear usuario con contraseña encriptada
export async function createUserHandler(req: Request, res: Response) {
  const result = userSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errores: result.error.issues });

  try {
    // Encriptar contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const nuevoUser = await createUser({
      ...result.data,
      password: hashedPassword
    });

    res.status(201).json(nuevoUser);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear usuario" });
  }
}

// Actualizar usuario (si incluye contraseña, también se encripta)
export async function updateUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = userSchema.partial().safeParse(req.body);
  if (!result.success) return res.status(400).json({ errores: result.error.issues });

  try {
    let dataToUpdate = result.data;

    // Si el usuario quiere cambiar la contraseña, la encriptamos
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    const userActualizado = await updateUser(id, dataToUpdate);
    res.status(200).json(userActualizado);
  } catch (error) {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
}

// Eliminar usuario
export async function deleteUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await deleteUser(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
}

// Login de usuario (comparar contraseña ingresada con la encriptada)
export async function loginUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await getAllUsers().then(users => users.find(u => u.email === email));
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    res.status(200).json({ mensaje: "Login exitoso", user });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el login" });
  }
}