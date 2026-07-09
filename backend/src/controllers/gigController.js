import { gigService } from '../services/GigService.js';

export function listar(req, res) {
  const result = gigService.listarGigs(req.query);
  res.json(result);
}

export function obtenerPorId(req, res) {
  const result = gigService.obtenerGigPorId(parseInt(req.params.id));
  res.json(result);
}

export function crear(req, res) {
  const result = gigService.crearGig(req.body, req.usuario.id);
  res.status(201).json(result);
}

export function agregarPaquete(req, res) {
  const result = gigService.agregarPaquete(req.params.id, req.body, req.usuario.id);
  res.status(201).json(result);
}

export function eliminarPaquete(req, res) {
  const result = gigService.eliminarPaquete(req.params.id, req.params.paqueteId, req.usuario.id);
  res.json(result);
}

export function agregarMultimedia(req, res) {
  const result = gigService.agregarMultimedia(req.params.id, req.body.url, req.usuario.id);
  res.status(201).json(result);
}

export function eliminarMultimedia(req, res) {
  // Pasamos la URL por el body porque en los DELETE por URL puede dar problemas con slashes
  const result = gigService.eliminarMultimedia(req.params.id, req.body.url, req.usuario.id);
  res.json(result);
}
