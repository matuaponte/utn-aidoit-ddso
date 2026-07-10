import { EstadoPedido } from '../models/EstadoPedido.js';

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

  async findByClienteWithPagination(clienteId, estadoFiltro, page = 1, limit = 10) {
    const resultado = await this.findAllByCliente(clienteId);
    const filtrado = this.#_aplicarFiltrosYOrdenar(resultado, estadoFiltro);
    return this.#_paginar(filtrado, page, limit);
  }

  async findAllByGigIds(gigIds) {
    return this.pedidos.filter((p) => gigIds.includes(p.gigId));
  }

  async findByGigsWithPagination(gigIds, gigIdFiltro, estadoFiltro, page = 1, limit = 10) {
    let resultado = await this.findAllByGigIds(gigIds);
    if (gigIdFiltro) {
      resultado = resultado.filter((p) => p.gigId === parseInt(gigIdFiltro));
    }
    const filtrado = this.#_aplicarFiltrosYOrdenar(resultado, estadoFiltro);
    return this.#_paginar(filtrado, page, limit);
  }

  #_aplicarFiltrosYOrdenar(array, estadoFiltro) {
    let filtrado = array;
    if (estadoFiltro) {
      if (estadoFiltro === 'ACTIVOS') {
        filtrado = filtrado.filter(p => [EstadoPedido.PENDIENTE, EstadoPedido.CONFIRMADO, EstadoPedido.EN_REVISION, EstadoPedido.PENDIENTE_CAMBIOS].includes(p.estado));
      } else if (estadoFiltro === 'REVISION') {
        filtrado = filtrado.filter(p => [EstadoPedido.EN_REVISION, EstadoPedido.PENDIENTE_CAMBIOS].includes(p.estado));
      } else if (estadoFiltro === EstadoPedido.ENTREGADO) {
        filtrado = filtrado.filter(p => p.estado === EstadoPedido.ENTREGADO);
      } else if (estadoFiltro === EstadoPedido.CANCELADO) {
        filtrado = filtrado.filter(p => p.estado === EstadoPedido.CANCELADO);
      }
    }

    filtrado.sort((a, b) => {
      const fechaA = new Date(a.historialEstados[0].fecha);
      const fechaB = new Date(b.historialEstados[0].fecha);
      return fechaB - fechaA; // Más recientes primero
    });
    
    return filtrado;
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
