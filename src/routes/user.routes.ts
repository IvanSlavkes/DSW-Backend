import { Router, type Request, type Response } from 'express';
import {
  listUsers,
  getUserHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/user.controller.js';
import { prisma } from '../lib/prisma.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireAdmin } from '../lib/permissions.js';
import bcrypt from 'bcrypt';

interface AuthenticatedRequest extends Request {
  user?: { id: number; role?: string; [key: string]: any };
}

const router = Router();

// Todas las rutas de /users requieren token
router.use(authMiddleware);

// Campos que se devuelven del perfil (sin contraseña)
const profileSelect = {
  id: true,
  name: true,
  lastName: true,
  email: true,
  role: true,
  localityId: true,
  description: true,
  position: true,
  birthDate: true,
};

// Campos que el usuario puede editar de SU propio perfil.
// Quedan afuera a propósito: role, averageRating, matchesPlayed, id.
const EDITABLE_PROFILE_FIELDS = [
  'name',
  'lastName',
  'email',
  'password',
  'description',
  'position',
  'birthDate',
  'localityId',
] as const;

// Perfil del usuario autenticado
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = Number((req as AuthenticatedRequest).user?.id);
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(user);
  } catch (err) {
    console.error('Error en /users/me:', err);
    return res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

router.put('/me', async (req: Request, res: Response) => {
  try {
    const userId = Number((req as AuthenticatedRequest).user?.id);
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    // Solo copiamos los campos permitidos (nunca role ni otros)
    const dataToUpdate: any = {};
    for (const field of EDITABLE_PROFILE_FIELDS) {
      if (req.body[field] !== undefined) dataToUpdate[field] = req.body[field];
    }

    // Si viene contraseña, la hasheamos antes de guardar
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    } else {
      delete dataToUpdate.password;
    }

    if (dataToUpdate.localityId) {
      dataToUpdate.localityId = String(dataToUpdate.localityId);
    }

    if (dataToUpdate.birthDate) {
      dataToUpdate.birthDate = new Date(dataToUpdate.birthDate);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: profileSelect,
    });

    return res.json(user);
  } catch (err) {
    console.error('Error en PUT /users/me:', err);
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Solo admin: listar, crear y borrar usuarios
router.get('/', requireAdmin, listUsers);
router.post('/', requireAdmin, createUserHandler);
router.delete('/:id', requireAdmin, deleteUserHandler);

// Dueño o admin (se verifica dentro del controller)
router.get('/:id', getUserHandler);
router.put('/:id', updateUserHandler);

export default router;
