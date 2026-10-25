import type { Request, Response } from "express";
import {
  createFieldCategory,
  deleteFieldCategory,
  getAllFieldCategories,
  getFieldCategoryById,
  updateFieldCategory,
} from "../services/field-category.service.js";
import { fieldCategorySchema } from "../schemas/field-category.schema.js";

function isPrismaErrorCode(error: unknown, code: string) {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

export async function listFieldCategories(_req: Request, res: Response) {
  const categories = await getAllFieldCategories();
  return res.json(categories);
}

export async function getFieldCategoryHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID de categoría inválido" });
  }

  const category = await getFieldCategoryById(id);
  if (!category) return res.status(404).json({ error: "Categoría no encontrada" });
  return res.json(category);
}

export async function createFieldCategoryHandler(req: Request, res: Response) {
  const parsed = fieldCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  try {
    const category = await createFieldCategory(parsed.data);
    return res.status(201).json(category);
  } catch (error) {
    if (isPrismaErrorCode(error, "P2002")) {
      return res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
    }
    throw error;
  }
}

export async function updateFieldCategoryHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID de categoría inválido" });
  }

  const parsed = fieldCategorySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  try {
    return res.json(await updateFieldCategory(id, parsed.data));
  } catch (error) {
    if (isPrismaErrorCode(error, "P2002")) {
      return res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
    }
    if (isPrismaErrorCode(error, "P2025")) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    throw error;
  }
}

export async function deleteFieldCategoryHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID de categoría inválido" });
  }

  try {
    await deleteFieldCategory(id);
    return res.status(204).send();
  } catch (error) {
    if (isPrismaErrorCode(error, "P2003")) {
      return res.status(409).json({ error: "No se puede eliminar una categoría asignada a canchas" });
    }
    if (isPrismaErrorCode(error, "P2025")) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    throw error;
  }
}
