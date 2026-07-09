import { BadRequestError, NotFoundError, ForbiddenError } from '../errors/AppError.js';
import { Pedido } from '../models/Pedido.js';
import { EstadoPedido } from '../models/EstadoPedido.js';
import { Mensaje } from '../models/Mensaje.js';
import { pedidoRepository } from '../repositories/PedidoRepository.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { getNextId } from '../utils/IdGenerator.js';

export class PedidoService {
  listarPedidos(usuarioId, rol, gigIdFiltro, page = 1, limit = 10) {
    let paginatedResult;

    if (rol === 'freelancer') {
      const misGigs = gigRepository.findByVendedorId(usuarioId);
      const misGigIds = misGigs.map(g => g.id);
      paginatedResult = pedidoRepository.findByGigsWithPagination(misGigIds, gigIdFiltro, page, limit);
    } else {
      paginatedResult = pedidoRepository.findByClienteWithPagination(usuarioId, page, limit);
    }

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(p => this.#_construirPedidoDTO(p))
    };
  }

  crearPedido(datos, clienteId) {
    const { gigId, paqueteId, requerimientos } = datos;

    if (!gigId || !paqueteId) {
      throw new BadRequestError('gigId y paqueteId son obligatorios');
    }

    const gig = gigRepository.findById(parseInt(gigId));
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

    pedidoRepository.save(nuevoPedido);
    return this.#_construirPedidoDTO(nuevoPedido);
  }

  cambiarEstado(pedidoId, nuevoEstado, usuarioId) {
    const pedido = pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    const gigAsociado = gigRepository.findById(pedido.gigId);
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
    if (nuevoEstado === EstadoPedido.ENTREGADO && !esCliente) {
      throw new ForbiddenError('Solo el cliente puede aceptar la entrega');
    }

    // Lógica de Dominio (Máquina de estados)
    pedido.actualizarEstado(nuevoEstado, usuarioId);

    pedidoRepository.save(pedido);
    return this.#_construirPedidoDTO(pedido);
  }

  obtenerPedidoPorId(pedidoId, usuarioId) {
    const pedido = pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }
    const pedidoPopulado = this.#_construirPedidoDTO(pedido);

    const esCliente = usuarioId === pedidoPopulado.clienteId;
    const esFreelancer = pedidoPopulado.gig && usuarioId === pedidoPopulado.gig.vendedorId;

    if (!esCliente && !esFreelancer) {
      throw new ForbiddenError('No tenés acceso a este pedido');
    }

    return pedidoPopulado;
  }

  // --- Subdominio: Mensajes ---

  listarMensajes(pedidoId, usuarioId) {
    const pedido = pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    const gig = gigRepository.findById(pedido.gigId);
    const esCliente = usuarioId === pedido.clienteId;
    const esFreelancer = gig && usuarioId === gig.vendedorId;

    if (!esCliente && !esFreelancer) {
      throw new ForbiddenError('No tenés acceso a los mensajes de este pedido');
    }

    return pedido.mensajes;
  }

  enviarMensaje(pedidoId, textoMensaje, usuarioId) {
    const pedido = pedidoRepository.findById(parseInt(pedidoId));
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    if (!textoMensaje || textoMensaje.trim() === '') {
      throw new BadRequestError('El mensaje no puede estar vacío');
    }

    const gig = gigRepository.findById(pedido.gigId);
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

    pedidoRepository.save(pedido);
    return nuevoMensaje;
  }

  // --- Helpers Privados ---
  #_construirPedidoDTO(pedido) {
    const gig = gigRepository.findById(pedido.gigId);
    const cliente = usuarioRepository.findById(pedido.clienteId);
    const paquete = gig ? gig.paquetes.find(p => p.id === pedido.paqueteId) : null;

    return {
      ...pedido,
      estado: pedido.estado,
      diasRestantes: pedido.calcularDiasRestantes(paquete ? paquete.diasEntrega : null),
      gig: gig ? { id: gig.id, nombre: gig.nombre, vendedorId: gig.vendedorId } : null,
      paqueteInfo: paquete,
      cliente: cliente ? { id: cliente.id, nombre: cliente.nombre } : null
    };
  }
}

export const pedidoService = new PedidoService();
