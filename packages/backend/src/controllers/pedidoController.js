import { pedidoService } from '../services/PedidoService.js';
import { crearPedidoSchema, cambiarEstadoSchema, enviarMensajeSchema } from '../schemas/pedidoSchema.js';

export async function listar(req, res, next) {
  try {
    console.log(`[PedidoController:listar] Req query:`, req.query, 'Usuario:', req.usuario.id);
    const result = await pedidoService.listarPedidos(
      req.usuario.id,
      req.query.rol,
      req.query.gigId,
      req.query.estado,
      req.query.page,
      req.query.limit
    );
    console.log(`[PedidoController:listar] Respondiendo ${result?.data?.length} pedidos.`);
    res.json(result);
  } catch (error) {
    console.error(`[PedidoController:listar] ERROR:`, error.message);
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const validData = crearPedidoSchema.parse(req.body);

    console.log(`[PedidoController:crear] Datos recibidos:`, validData, 'Usuario:', req.usuario.id);
    const result = await pedidoService.crearPedido(validData, req.usuario.id);
    console.log(`[PedidoController:crear] Pedido creado exitosamente:`, result.id);
    res.status(201).json(result);
  } catch (error) {
    console.error(`[PedidoController:crear] ERROR:`, error.message);
    next(error);
  }
}

export async function cambiarEstado(req, res, next) {
  try {
    const { nuevoEstado } = cambiarEstadoSchema.parse(req.body);

    console.log(`[PedidoController:cambiarEstado] Pedido ID: ${req.params.id}, Nuevo Estado: ${nuevoEstado}`);
    const result = await pedidoService.cambiarEstado(req.params.id, nuevoEstado, req.usuario.id);
    console.log(`[PedidoController:cambiarEstado] Estado cambiado exitosamente a:`, result.estado);
    res.json(result);
  } catch (error) {
    console.error(`[PedidoController:cambiarEstado] ERROR:`, error.message);
    next(error);
  }
}

export async function obtenerPorId(req, res, next) {
  try {
    console.log(`[PedidoController:obtenerPorId] Solicitando pedido ID: ${req.params.id}`);
    const result = await pedidoService.obtenerPedidoPorId(req.params.id, req.usuario.id);
    console.log(`[PedidoController:obtenerPorId] Pedido enviado.`);
    res.json(result);
  } catch (error) {
    console.error(`[PedidoController:obtenerPorId] ERROR:`, error.message);
    next(error);
  }
}

export async function listarMensajes(req, res, next) {
  try {
    console.log(`[PedidoController:listarMensajes] Pedido ID: ${req.params.pedidoId}, Usuario: ${req.usuario.id}`);
    const result = await pedidoService.listarMensajes(req.params.pedidoId, req.usuario.id);
    console.log(`[PedidoController:listarMensajes] Respondiendo ${result.length} mensajes.`);
    res.json(result);
  } catch (error) {
    console.error(`[PedidoController:listarMensajes] ERROR:`, error.message);
    next(error);
  }
}

export async function enviarMensaje(req, res, next) {
  try {
    console.log(`[PedidoController:enviarMensaje] Pedido ID: ${req.params.pedidoId}, Usuario: ${req.usuario.id}`);
    const { mensaje } = enviarMensajeSchema.parse(req.body);
    
    const result = await pedidoService.enviarMensaje(req.params.pedidoId, mensaje, req.usuario.id);
    console.log(`[PedidoController:enviarMensaje] Mensaje enviado exitosamente:`, result.id);
    res.status(201).json(result);
  } catch (error) {
    console.error(`[PedidoController:enviarMensaje] ERROR:`, error.message);
    next(error);
  }
}
