export class PedidoRepository {
  constructor() {
    this.pedidos = [];
  }

  async findAll() {
    return this.pedidos;
  }

  async findById(id) {
    return this.pedidos.find((p) => p.id === id);
  }

  async findAllByCliente(clienteId) {
    return this.pedidos.filter((p) => p.clienteId === clienteId);
  }

  async findByClienteWithPagination(clienteId, page = 1, limit = 10) {
    const resultado = await this.findAllByCliente(clienteId);
    return this.#_paginar(resultado, page, limit);
  }

  async findAllByGigIds(gigIds) {
    return this.pedidos.filter((p) => gigIds.includes(p.gigId));
  }

  async findByGigsWithPagination(gigIds, gigIdFiltro, page = 1, limit = 10) {
    let resultado = await this.findAllByGigIds(gigIds);
    if (gigIdFiltro) {
      resultado = resultado.filter((p) => p.gigId === parseInt(gigIdFiltro));
    }
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



  async save(pedido) {
    const index = this.pedidos.findIndex((p) => p.id === pedido.id);
    if (index !== -1) {
      this.pedidos[index] = pedido;
    } else {
      this.pedidos.push(pedido);
    }
  }
}

export const pedidoRepository = new PedidoRepository();
