import { BadRequestError } from '../errors/AppError.js';

export class Paquete {
  constructor(id, nombre, descripcion, precio, diasEntrega) {
    if (!nombre || !descripcion || !precio || !diasEntrega) {
      throw new BadRequestError('Todos los campos del paquete son obligatorios');
    }
    if (precio <= 0 || diasEntrega <= 0) {
      throw new BadRequestError('El precio y los días de entrega deben ser mayores a 0');
    }
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.diasEntrega = diasEntrega;
  }
}
