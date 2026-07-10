import { CambioEstadoPedido } from './CambioEstadoPedido.js';
import { EstadoPedido } from './EstadoPedido.js';
import { BadRequestError, ForbiddenError } from '../errors/AppError.js';

export const TRANSICIONES_VALIDAS = {
  [EstadoPedido.PENDIENTE]: [EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO],
  [EstadoPedido.CONFIRMADO]: [EstadoPedido.EN_REVISION, EstadoPedido.CANCELADO],
  [EstadoPedido.EN_REVISION]: [EstadoPedido.ENTREGADO, EstadoPedido.PENDIENTE_CAMBIOS, EstadoPedido.CANCELADO],
  [EstadoPedido.PENDIENTE_CAMBIOS]: [EstadoPedido.EN_REVISION, EstadoPedido.CANCELADO],
  [EstadoPedido.ENTREGADO]: [],
  [EstadoPedido.CANCELADO]: [],
};

export class Pedido {
  constructor(id, clienteId, gigId, paqueteId, total, requerimientos, historialEstados = [], mensajes = []) {
    if (!gigId || !paqueteId) {
      throw new BadRequestError('gigId y paqueteId son obligatorios para crear un Pedido');
    }
    if(total < 0) throw new BadRequestError('El total debe ser mayor o igual a 0');
    this.id = id;
    this.clienteId = clienteId;
    this.gigId = gigId;
    this.paqueteId = paqueteId;
    this.total = total;
    this.requerimientos = requerimientos;
    this.mensajes = mensajes;
    
    this.historialEstados = historialEstados;
    if (this.historialEstados.length === 0) {
      this.historialEstados.push(new CambioEstadoPedido(EstadoPedido.PENDIENTE, clienteId));
    }
  }

  get estado() {
    return this.historialEstados[this.historialEstados.length - 1].estado;
  }

  calcularDiasRestantes(diasEntrega) {
    if (this.estado !== EstadoPedido.CONFIRMADO) return null;
    if (!diasEntrega) return null;

    const cambioConfirmado = this.historialEstados.find(h => h.estado === EstadoPedido.CONFIRMADO);
    if (!cambioConfirmado) return null;

    const fechaLimite = new Date(cambioConfirmado.fecha);
    fechaLimite.setDate(fechaLimite.getDate() + diasEntrega);
    
    const ahora = new Date();
    let diasRestantes = Math.ceil((fechaLimite - ahora) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) diasRestantes = 0;
    
    return diasRestantes;
  }

  actualizarEstado(nuevoEstado, usuarioLogueadoId) {
    if (!nuevoEstado) {
      throw new BadRequestError('nuevoEstado es obligatorio');
    }

    const estadoActual = this.estado;
    const transicionesPermitidas = TRANSICIONES_VALIDAS[estadoActual];
    
    if (!transicionesPermitidas || !transicionesPermitidas.includes(nuevoEstado)) {
      throw new BadRequestError(`No se puede pasar de ${estadoActual} a ${nuevoEstado}`);
    }

    this.historialEstados.push(new CambioEstadoPedido(nuevoEstado, usuarioLogueadoId));
  }

  agregarMensaje(mensaje) {
    this.mensajes.push(mensaje);
  }
  eliminarMensaje(mensajeId) {
    this.mensajes = this.mensajes.filter(m => m.id !== mensajeId);
  }
}
