export class CambioEstadoPedido {
  constructor(estado, usuarioId, fecha = new Date()) {
    this.estado = estado;
    this.usuarioId = usuarioId;
    this.fecha = fecha;
  }
}
