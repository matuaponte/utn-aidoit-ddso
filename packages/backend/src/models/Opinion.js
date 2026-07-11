import { BadRequestError } from '../errors/AppError.js';

export class Opinion {
  constructor(id, pedidoId, gigId, clienteId, puntuacion, detalle, fecha = new Date()) {
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      throw new BadRequestError('La puntuación debe ser entre 1 y 5');
    }

    if (!detalle || detalle.trim() === '') {
      throw new BadRequestError('El detalle de la opinión es obligatorio');
    }

    this.id = id;
    this.pedidoId = pedidoId;
    this.gigId = gigId;
    this.clienteId = clienteId;
    this.puntuacion = puntuacion;
    this.detalle = detalle.trim();
    this.fecha = fecha;
  }
}
