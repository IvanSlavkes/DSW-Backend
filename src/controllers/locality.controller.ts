import type { Request, Response } from "express";
import fetch from "node-fetch"; 
import { 
  getAllLocalities, 
  getLocalityById, 
  createLocality, 
  updateLocality, 
  deleteLocality 
} from "../services/locality.service.js";

type LocalidadApi = {
  id: string;
  nombre: string;
};

type GeoRefResponse = {
  localidades: LocalidadApi[];
};

// Listar todas las localidades guardadas en tu base
export async function listLocalities(req: Request, res: Response) {
  const localities = await getAllLocalities();
  res.json(localities);
}

// Obtener una localidad por ID
export async function getLocalityHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const locality = await getLocalityById(id);
  if (!locality) return res.status(404).json({ mensaje: "Localidad no encontrada" });
  res.json(locality);
}

// Crear localidad usando la API
export async function createLocalityHandler(req: Request, res: Response) {
  const { nombre } = req.body;

  try {
    // Consultar API GeoRef con el nombre
    const response = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?nombre=${nombre}`);
    const data = await response.json() as GeoRefResponse;

    if (!data.localidades || data.localidades.length === 0) {
      return res.status(404).json({ mensaje: "Localidad no encontrada en la API" });
    }

    const localidadApi = data.localidades[0]!; // primera coincidencia

    const nuevaLocalidad = await createLocality({
      id: localidadApi.id,
      nombre: localidadApi.nombre
    });

    res.status(201).json(nuevaLocalidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear localidad desde API" });
  }
}

// Actualizar localidad (solo nombre, el id no cambia)
export async function updateLocalityHandler(req: Request, res: Response) {
  const id = req.params.id as string;   
  const { nombre } = req.body;
  try {
    const localityUpdated = await updateLocality(id, { nombre });
    res.json(localityUpdated);
  } catch (error) {
    res.status(404).json({ mensaje: "Localidad no encontrada" });
  }
}

// Eliminar localidad
export async function deleteLocalityHandler(req: Request, res: Response) {
  const id = req.params.id as string;   
  try {
    await deleteLocality(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ mensaje: "Localidad no encontrada" });
  }
}