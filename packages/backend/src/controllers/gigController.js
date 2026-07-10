import { gigService } from '../services/GigService.js';
import { crearGigSchema, paqueteSchema, urlSchema } from '../schemas/gigSchema.js';

export async function listar(req, res, next) {
  try {
    console.log(`[GigController:listar] Req query (Filtros):`, req.query);
    const result = await gigService.listarGigs(req.query);
    console.log(`[GigController:listar] Retornando ${result?.data?.length} Gigs paginados.`);
    res.json(result);
  } catch (error) {
    console.error(`[GigController:listar] ERROR:`, error.message);
    next(error);
  }
}

export async function obtenerPorId(req, res, next) {
  try {
    console.log(`[GigController:obtenerPorId] Solicitando Gig ID: ${req.params.id}`);
    const result = await gigService.obtenerGigPorId(parseInt(req.params.id));
    console.log(`[GigController:obtenerPorId] Gig encontrado.`);
    res.json(result);
  } catch (error) {
    console.error(`[GigController:obtenerPorId] ERROR:`, error.message);
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const validData = crearGigSchema.parse(req.body);

    console.log(`[GigController:crear] Datos recibidos:`, { nombre: validData.nombre, descripcion: validData.descripcion, categoriaId: validData.categoriaId }, 'Vendedor:', req.usuario.id);
    const result = await gigService.crearGig(validData, req.usuario.id);
    console.log(`[GigController:crear] Gig creado exitosamente, ID:`, result.id);
    res.status(201).json(result);
  } catch (error) {
    console.error(`[GigController:crear] ERROR:`, error.message);
    next(error);
  }
}

export async function agregarPaquete(req, res, next) {
  try {
    const validData = paqueteSchema.parse(req.body);

    const result = await gigService.agregarPaquete(req.params.id, validData, req.usuario.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function eliminarPaquete(req, res, next) {
  try {
    const result = await gigService.eliminarPaquete(req.params.id, req.params.paqueteId, req.usuario.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function agregarMultimedia(req, res, next) {
  try {
    const { url } = urlSchema.parse(req.body);

    const result = await gigService.agregarMultimedia(req.params.id, url, req.usuario.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function eliminarMultimedia(req, res, next) {
  try {
    const { url } = urlSchema.parse(req.body);

    const result = await gigService.eliminarMultimedia(req.params.id, url, req.usuario.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
