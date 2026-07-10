import { BadRequestError, NotFoundError, ForbiddenError } from '../errors/AppError.js';
import { Pedido } from '../models/Pedido.js';
import { EstadoPedido } from '../models/EstadoPedido.js';
import { Mensaje } from '../models/Mensaje.js';
import { pedidoRepository } from '../repositories/PedidoRepository.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { opinionRepository } from '../repositories/OpinionRepository.js';
import { getNextId } from '../utils/IdGenerator.js';

export class PedidoService {
  async listarPedidos(usuarioId, rol, gigIdFiltro, estadoFiltro, page = 1, limit = 10) {
    let paginatedResult;

    if (rol === 'freelancer') {
      const misGigs = await gigRepository.findByVendedorId(usuarioId);
      const misGigIds = misGigs.map(g => g.id);
      paginatedResult = await pedidoRepository.findByGigsWithPagination(misGigIds, gigIdFiltro, estadoFiltro, page, limit);
    } else {
      paginatedResult = await pedidoRepository.findByClienteWithPagination(usuarioId, estadoFiltro, page, limit);
    }

    const dataConDTO = await Promise.all(paginatedResult.data.map(p => this.#_construirPedidoDTO(p)));

    return {
      ...paginatedResult,
      data: dataConDTO
    };
  }

  async crearPedido(datos, clienteId) {
    const { gigId, paqueteId, requerimientos } = datos;

    if (!gigId || !paqueteId) {
      throw new BadRequestError('gigId y paqueteId son obligatorios');
    }

    const gig = await gigRepository.findById(parseInt(gigId));
    if (!gig) {
      throw new NotFoundError('Gig no encontrado');
    }

    if (gig.vendedorId === clienteId) {
      throw new BadRequestError('No podés comprar tu propio Gig');
    }

    const paquete = gig.paquetes.find((p) => p.id === parseInt(paqueteId));
    if (!paquete) {
      throw new NotFoundError('Paquete no encontrado en este Gig');
    }

    const nuevoPedido = new Pedido(
      getNextId('pedidos'),
      clienteId,
      gig.id,
      paquete.id,
      paquete.precio,
      requerimientos || ''
    );

    await pedidoRepository.save(nuevoPedido);
    return await this.#_construirPedidoDTO(nuevoPedido);
  }

  async cambiarEstado(pedidoId, nuevoEstado, usuarioId) {
    const pedido = await pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    const gigAsociado = await gigRepository.findById(pedido.gigId);
    if (!gigAsociado) {
      throw new NotFoundError('Gig no encontrado');
    }

    // Lógica de Autorización (Seguridad)
    const esCliente = usuarioId === pedido.clienteId;
    const esFreelancer = usuarioId === gigAsociado.vendedorId;

    if (nuevoEstado === EstadoPedido.CANCELADO && !esCliente && !esFreelancer) {
      throw new ForbiddenError('Solo el cliente o el freelancer pueden cancelar el pedido');
    }
    if (nuevoEstado === EstadoPedido.CONFIRMADO && !esFreelancer) {
      throw new ForbiddenError('Solo el freelancer puede confirmar un pedido');
    }
    if (nuevoEstado === EstadoPedido.EN_REVISION && !esFreelancer) {
      throw new ForbiddenError('Solo el freelancer puede enviar a revisión');
    }
    if (nuevoEstado === EstadoPedido.PENDIENTE_CAMBIOS && !esCliente) {
      throw new ForbiddenError('Solo el cliente puede solicitar cambios');
    }
    if (nuevoEstado === EstadoPedido.ENTREGADO && !esCliente) {
      throw new ForbiddenError('Solo el cliente puede aceptar la entrega');
    }

    // Lógica de Dominio (Máquina de estados)
    pedido.actualizarEstado(nuevoEstado, usuarioId);

    await pedidoRepository.save(pedido);
    return await this.#_construirPedidoDTO(pedido);
  }

  async obtenerPedidoPorId(pedidoId, usuarioId) {
    const pedido = await pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }
    const pedidoPopulado = await this.#_construirPedidoDTO(pedido);

    const esCliente = usuarioId === pedidoPopulado.clienteId;
    const esFreelancer = pedidoPopulado.gig && usuarioId === pedidoPopulado.gig.vendedorId;

    if (!esCliente && !esFreelancer) {
      throw new ForbiddenError('No tenés acceso a este pedido');
    }

    return pedidoPopulado;
  }

  // --- Subdominio: Mensajes ---

  async listarMensajes(pedidoId, usuarioId) {
    const pedido = await pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    const gig = await gigRepository.findById(pedido.gigId);
    const esCliente = usuarioId === pedido.clienteId;
    const esFreelancer = gig && usuarioId === gig.vendedorId;

    if (!esCliente && !esFreelancer) {
      throw new ForbiddenError('No tenés acceso a los mensajes de este pedido');
    }

    return pedido.mensajes;
  }

  async enviarMensaje(pedidoId, textoMensaje, usuarioId) {
    const pedido = await pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    if (!textoMensaje || textoMensaje.trim() === '') {
      throw new BadRequestError('El mensaje no puede estar vacío');
    }

    const gig = await gigRepository.findById(pedido.gigId);
    const esCliente = usuarioId === pedido.clienteId;
    const esFreelancer = gig && usuarioId === gig.vendedorId;

    if (!esCliente && !esFreelancer) {
      throw new ForbiddenError('No tenés acceso a este pedido');
    }

    const nuevoMensaje = new Mensaje(
      getNextId('mensajes'),
      usuarioId,
      textoMensaje.trim()
    );

    // Método de dominio
    pedido.agregarMensaje(nuevoMensaje);

    await pedidoRepository.save(pedido);
    return nuevoMensaje;
  }

  // --- Helpers Privados ---
  async #_construirPedidoDTO(pedido) {
    const gig = await gigRepository.findById(pedido.gigId);
    const cliente = await usuarioRepository.findById(pedido.clienteId);
    const freelancer = gig ? await usuarioRepository.findById(gig.vendedorId) : null;
    const paquete = gig ? gig.paquetes.find(p => p.id === pedido.paqueteId) : null;
    const fechaCreacion = pedido.historialEstados && pedido.historialEstados.length > 0 ? pedido.historialEstados[0].fecha : new Date();

    const opinion = await opinionRepository.findByPedidoId(pedido.id);

    return {
      ...pedido,
      estado: pedido.estado,
      diasRestantes: pedido.calcularDiasRestantes(paquete ? paquete.diasEntrega : null),
      gig: gig ? { id: gig.id, titulo: gig.nombre, vendedorId: gig.vendedorId } : null,
      paquete: paquete,
      cliente: cliente ? { id: cliente.id, nombre: cliente.nombre, apellido: cliente.apellido } : null,
      freelancer: freelancer ? { id: freelancer.id, nombre: freelancer.nombre, apellido: freelancer.apellido } : null,
      freelancerId: gig ? gig.vendedorId : null,
      precioAcordado: pedido.total,
      fechaCreacion: fechaCreacion,
      yaOpinado: !!opinion
    };
  }
}

export const pedidoService = new PedidoService();
