import { opinionService } from '../services/OpinionService.js';
import { crearOpinionSchema } from '../schemas/opinionSchema.js';

export async function crear(req, res, next) {
  try {
    const validData = crearOpinionSchema.parse(req.body);

    const result = await opinionService.crearOpinion(validData, req.params.pedidoId, req.usuario.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listarPorGig(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await opinionService.listarOpinionesPorGig(req.params.gigId, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
