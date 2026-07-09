import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../errors/AppError.js';
import { Opinion } from '../models/Opinion.js';
import { EstadoPedido } from '../models/EstadoPedido.js';
import { opinionRepository } from '../repositories/OpinionRepository.js';
import { pedidoRepository } from '../repositories/PedidoRepository.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { getNextId } from '../utils/IdGenerator.js';

export class OpinionService {
  crearOpinion(datos, pedidoId, usuarioId) {
    const { puntuacion, detalle } = datos;
    const pedido = pedidoRepository.findById(parseInt(pedidoId));

    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    if (usuarioId !== pedido.clienteId) {
      throw new ForbiddenError('Solo el cliente puede dejar una opinión');
    }

    if (pedido.estado !== EstadoPedido.ENTREGADO) {
      throw new BadRequestError('Solo se puede opinar sobre pedidos entregados');
    }

    const opinionExistente = opinionRepository.findByPedidoId(pedido.id);
    if (opinionExistente) {
      throw new ConflictError('Ya dejaste una opinión para este pedido');
    }

    const nuevaOpinion = new Opinion(
      getNextId('opiniones'),
      pedido.id,
      pedido.gigId,
      usuarioId,
      puntuacion,
      detalle
    );

    opinionRepository.save(nuevaOpinion);

    // Delegamos el recálculo a la clase de Dominio "Gig"
    const gig = gigRepository.findById(pedido.gigId);
    if (gig) {
      const opinionesDelGig = opinionRepository.findAllByGigId(gig.id);
      gig.recalcularPuntajePromedio(opinionesDelGig);
      gigRepository.save(gig);
    }

    return nuevaOpinion;
  }

  listarOpinionesPorGig(gigId, page = 1, limit = 10) {
    const gig = gigRepository.findById(parseInt(gigId));
    if (!gig) {
      throw new NotFoundError('Gig no encontrado');
    }

    return opinionRepository.findAllByGigIdWithPagination(parseInt(gigId), page, limit);
  }
}

export const opinionService = new OpinionService();
