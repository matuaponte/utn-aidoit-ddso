import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../errors/AppError.js';
import { Opinion } from '../models/Opinion.js';
import { EstadoPedido } from '../models/EstadoPedido.js';
import { opinionRepository } from '../repositories/OpinionRepository.js';
import { pedidoRepository } from '../repositories/PedidoRepository.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { getNextId } from '../utils/IdGenerator.js';

export class OpinionService {
  async crearOpinion(datos, pedidoId, usuarioId) {
    const { puntuacion, detalle } = datos;
    const pedido = await pedidoRepository.findById(parseInt(pedidoId));

    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    if (usuarioId !== pedido.clienteId) {
      throw new ForbiddenError('Solo el cliente puede dejar una opinión');
    }

    if (pedido.estado !== EstadoPedido.ENTREGADO) {
      throw new BadRequestError('Solo se puede opinar sobre pedidos entregados');
    }

    const opinionExistente = await opinionRepository.findByPedidoId(pedido.id);
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

    await opinionRepository.save(nuevaOpinion);

    // Delegamos el recálculo a la clase de Dominio "Gig"
    const gig = await gigRepository.findById(pedido.gigId);
    if (gig) {
      const opinionesDelGig = await opinionRepository.findAllByGigId(gig.id);
      gig.recalcularPuntajePromedio(opinionesDelGig);
      await gigRepository.save(gig);
    }

    return nuevaOpinion;
  }

  async listarOpinionesPorGig(gigId, page = 1, limit = 10) {
    const gig = await gigRepository.findById(parseInt(gigId));
    if (!gig) {
      throw new NotFoundError('Gig no encontrado');
    }

    const paginated = await opinionRepository.findAllByGigIdWithPagination(parseInt(gigId), page, limit);
    
    // Populating cliente
    const { usuarioRepository } = await import('../repositories/UsuarioRepository.js');
    for (const opinion of paginated.data) {
      const u = await usuarioRepository.findById(opinion.clienteId);
      // Solo enviamos datos publicos basicos
      if (u) {
        opinion.usuario = {
          id: u.id,
          nombre: u.nombre,
          apellido: u.apellido
        };
      }
    }
    
    return paginated;
  }
}

export const opinionService = new OpinionService();
