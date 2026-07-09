export class OpinionRepository {
  constructor() {
    this.opiniones = [];
  }

  findAll() {
    return this.opiniones;
  }

  findById(id) {
    return this.opiniones.find((o) => o.id === id);
  }

  findByPedidoId(pedidoId) {
    return this.opiniones.find((o) => o.pedidoId === pedidoId);
  }

  findAllByGigId(gigId) {
    return this.opiniones.filter((o) => o.gigId === gigId);
  }

  findAllByGigIdWithPagination(gigId, page = 1, limit = 10) {
    const resultado = this.findAllByGigId(gigId);
    return this.#_paginar(resultado, page, limit);
  }

  #_paginar(array, page, limit) {
    const paginaEntera = parseInt(page);
    const limiteEntero = parseInt(limit);
    
    const startIndex = (paginaEntera - 1) * limiteEntero;
    const endIndex = startIndex + limiteEntero;
    
    const dataPaginada = array.slice(startIndex, endIndex);

    return {
      data: dataPaginada,
      total: array.length,
      page: paginaEntera,
      limit: limiteEntero,
      totalPages: Math.ceil(array.length / limiteEntero)
    };
  }

  save(opinion) {
    const index = this.opiniones.findIndex((o) => o.id === opinion.id);
    if (index !== -1) {
      this.opiniones[index] = opinion;
    } else {
      this.opiniones.push(opinion);
    }
  }
}

export const opinionRepository = new OpinionRepository();
