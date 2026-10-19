import { Router, type Request, type Response } from "express";
import { 
  listUsers, 
  getUserHandler, 
  createUserHandler, 
  updateUserHandler, 
  deleteUserHandler 
} from "../controllers/user.controller.js";
import { prisma } from "../lib/prisma.js";
import authMiddleware from "../middleware/auth.middleware.js";
import bcrypt from "bcrypt";

interface AuthenticatedRequest extends Request {
  user?: { id: number; role?: string; [key: string]: any };
}

const router = Router();

// 🔹 Todas las rutas de /users requieren token
router.use(authMiddleware);

// Perfil del usuario autenticado
router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = Number((req as AuthenticatedRequest).user?.id);
    if (!userId) return res.status(401).json({ error: "No autorizado" });

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { 
        id: true,
        name: true,
        lastName: true,   // 🔹 agregado
        email: true,
        role: true,
        localityId: true,
        description: true,
        position: true,
        birthDate: true
      }
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json(user);
  } catch (err) {
    console.error("Error en /users/me:", err);
    return res.status(500).json({ error: "Error al obtener usuario" });
  }
});

router.put("/me", async (req: Request, res: Response) => {
  try {
    const userId = Number((req as AuthenticatedRequest).user?.id);
    if (!userId) return res.status(401).json({ error: "No autorizado" });

    const dataToUpdate: any = { ...req.body };

    // 🔹 Si viene contraseña, la hasheamos antes de guardar
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    // 🔹 Convertir localityId a número si viene
    if (dataToUpdate.localityId) {
      dataToUpdate.localityId = Number(dataToUpdate.localityId);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { 
        id: true,
        name: true,
        lastName: true,   // 🔹 agregado
        email: true,
        role: true,
        localityId: true,
        description: true,
        position: true,
        birthDate: true
      }
    });

    return res.json(user);
  } catch (err) {
    console.error("Error en PUT /users/me:", err);
    return res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// CRUD (también protegidas por token)
router.get("/", listUsers);
router.get("/:id", getUserHandler);
router.post("/", createUserHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);

export default router;
