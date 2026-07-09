export class GigRepository {
  constructor() {
    this.gigs = [];
  }

  findAll() {
    return this.gigs;
  }

  findById(id) {
    return this.gigs.find((g) => g.id === id);
  }

  findByVendedorId(vendedorId) {
    return this.gigs.filter((g) => g.vendedorId === vendedorId);
  }

  findWithFiltersAndPagination(filtros) {
    const { q, categoriaId, ordenar, puntajeMinimo, page = 1, limit = 10 } = filtros;
    let resultado = [...this.gigs];

    // 1. Filtrado
    if (q) {
      const busqueda = q.toLowerCase();
      resultado = resultado.filter(
        (g) =>
          g.nombre.toLowerCase().includes(busqueda) ||
          g.descripcion.toLowerCase().includes(busqueda)
      );
    }

    if (categoriaId) {
      resultado = resultado.filter((g) => g.categoriaId === parseInt(categoriaId));
    }

    if (puntajeMinimo) {
      const min = parseFloat(puntajeMinimo);
      resultado = resultado.filter((g) => g.puntajePromedio >= min);
    }

    // 2. Ordenamiento
    if (ordenar) {
      switch (ordenar) {
        case 'precio_asc':
          resultado.sort((a, b) => {
            const minA = Math.min(...a.paquetes.map((p) => p.precio));
            const minB = Math.min(...b.paquetes.map((p) => p.precio));
            return minA - minB;
          });
          break;
        case 'precio_desc':
          resultado.sort((a, b) => {
            const minA = Math.min(...a.paquetes.map((p) => p.precio));
            const minB = Math.min(...b.paquetes.map((p) => p.precio));
            return minB - minA;
          });
          break;
        case 'puntaje_desc':
          resultado.sort((a, b) => b.puntajePromedio - a.puntajePromedio);
          break;
        case 'puntaje_asc':
          resultado.sort((a, b) => a.puntajePromedio - b.puntajePromedio);
          break;
        case 'fecha_asc':
          resultado.sort((a, b) => new Date(a.fechaPublicacion) - new Date(b.fechaPublicacion));
          break;
        case 'fecha_desc':
          resultado.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
          break;
      }
    }

    // 3. Paginación
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


  save(gig) {
    const index = this.gigs.findIndex((g) => g.id === gig.id);
    if (index !== -1) {
      this.gigs[index] = gig;
    } else {
      this.gigs.push(gig);
    }
  }
}

export const gigRepository = new GigRepository();
