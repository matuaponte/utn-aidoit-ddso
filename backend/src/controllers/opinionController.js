import { opinionService } from '../services/OpinionService.js';

export function crear(req, res) {
  const result = opinionService.crearOpinion(req.body, req.params.pedidoId, req.usuario.id);
  res.status(201).json(result);
}

export function listarPorGig(req, res) {
  const { page, limit } = req.query;
  const result = opinionService.listarOpinionesPorGig(req.params.gigId, page, limit);
  res.json(result);
}
