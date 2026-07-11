import { BadRequestError } from '../errors/AppError.js';

export class Gig {
  constructor(id, nombre, descripcion, categoriaId, vendedorId, paquetes = [], multimedia = [], fechaPublicacion = new Date()) {
    if (!nombre || !descripcion) {
      throw new BadRequestError('El Gig debe tener un nombre y una descripción');
    }
    if (!categoriaId || !vendedorId) {
      throw new BadRequestError('El Gig debe estar asociado a una categoría y a un vendedor');
    }
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.categoriaId = categoriaId;
    this.vendedorId = vendedorId;
    this.paquetes = paquetes;
    this.multimedia = multimedia;
    this.fechaPublicacion = fechaPublicacion;
    this.puntajePromedio = 0;
  }

  recalcularPuntajePromedio(opiniones) {
    if (!opiniones || opiniones.length === 0) {
      this.puntajePromedio = 0;
      return;
    }
    const opinionesDelGig = opiniones.filter(o => o.gigId === this.id);
    if (opinionesDelGig.length === 0) {
      this.puntajePromedio = 0;
      return;
    }
    const sumaPuntajes = opinionesDelGig.reduce((sum, o) => sum + o.puntuacion, 0);
    this.puntajePromedio = sumaPuntajes / opinionesDelGig.length;
  }

  tuPrecioEstaEntre(min, max) {
    if (this.paquetes.length === 0) return false;
    const precioMinimo = Math.min(...this.paquetes.map(p => p.precio));
    return precioMinimo >= min && precioMinimo <= max;
  }

  agregarPaquete(paquete) {
    this.paquetes.push(paquete);
  }

  agregarMultimedia(url) {
    this.multimedia.push(url);
  }

  eliminarPaquete(paqueteId) {
    this.paquetes = this.paquetes.filter(p => p.id !== paqueteId);
  }

  eliminarMultimedia(url) {
    this.multimedia = this.multimedia.filter(m => m !== url);
  }

}
