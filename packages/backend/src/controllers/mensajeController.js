import { pedidoService } from '../services/PedidoService.js';

export function listar(req, res) {
  const result = pedidoService.listarMensajes(req.params.pedidoId, req.usuario.id);
  res.json(result);
}

export function enviar(req, res) {
  const result = pedidoService.enviarMensaje(req.params.pedidoId, req.body.mensaje, req.usuario.id);
  res.status(201).json(result);
}
