import { pedidoService } from '../services/PedidoService.js';

export function listar(req, res) {
  const result = pedidoService.listarPedidos(
    req.usuario.id,
    req.query.rol,
    req.query.gigId,
    req.query.page,
    req.query.limit
  );
  res.json(result);
}

export function crear(req, res) {
  const result = pedidoService.crearPedido(req.body, req.usuario.id);
  res.status(201).json(result);
}

export function cambiarEstado(req, res) {
  const result = pedidoService.cambiarEstado(req.params.id, req.body.nuevoEstado, req.usuario.id);
  res.json(result);
}

export function obtenerPorId(req, res) {
  const result = pedidoService.obtenerPedidoPorId(req.params.id, req.usuario.id);
  res.json(result);
}
