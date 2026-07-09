import { BadRequestError } from '../errors/AppError.js';

export class Mensaje {
  constructor(id, usuarioId, mensaje, enviado = new Date()) {
    if (!mensaje || mensaje.trim() === '') {
      throw new BadRequestError('El texto del mensaje es obligatorio');
    }
    if (!usuarioId) {
      throw new BadRequestError('El usuario es obligatorio');
    }
    this.id = id;
    this.usuarioId = usuarioId;
    this.mensaje = mensaje;
    this.enviado = enviado;
  }
}
