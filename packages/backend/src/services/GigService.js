import { BadRequestError, NotFoundError, ForbiddenError } from '../errors/AppError.js';
import { Gig } from '../models/Gig.js';
import { Paquete } from '../models/Paquete.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { categoriaRepository } from '../repositories/CategoriaRepository.js';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { opinionRepository } from '../repositories/OpinionRepository.js';
import { getNextId } from '../utils/IdGenerator.js';

export class GigService {
  async listarGigs(filtros) {
    const paginatedResult = await gigRepository.findWithFiltersAndPagination(filtros);

    // Devolvemos populados manteniendo la metadata de paginación
    const dataConDTO = await Promise.all(paginatedResult.data.map(g => this.#_construirGigDTO(g)));
    return {
      ...paginatedResult,
      data: dataConDTO
    };
  }

  async obtenerGigPorId(id) {
    const gig = await gigRepository.findById(id);
    if (!gig) {
      throw new NotFoundError('Gig no encontrado');
    }
    return await this.#_construirGigDTO(gig);
  }

  async crearGig(datos, vendedorId) {
    const { nombre, descripcion, categoriaId, paquetes, multimedia } = datos;

    const categoria = await categoriaRepository.findById(parseInt(categoriaId));
    if (!categoria) {
      throw new NotFoundError('Categoría no encontrada');
    }

    const nuevoGig = new Gig(getNextId('gigs'),nombre,descripcion,parseInt(categoriaId),vendedorId);

    for (const paq of paquetes) {
      nuevoGig.agregarPaquete(new Paquete(getNextId('paquetes'),paq.nombre,paq.descripcion,paq.precio,paq.diasEntrega));
    }

    if (multimedia && Array.isArray(multimedia)) {
      multimedia.forEach(url => nuevoGig.agregarMultimedia(url));
    }

    await gigRepository.save(nuevoGig);
    return await this.#_construirGigDTO(nuevoGig); //Para simular una populacion
  }


  async agregarPaquete(gigId, datosPaquete, vendedorId) {
    const gig = await gigRepository.findById(parseInt(gigId));
    if (!gig) throw new NotFoundError('Gig no encontrado');
    if (gig.vendedorId !== vendedorId) throw new ForbiddenError('No sos el dueño de este Gig');

    const nuevoPaquete = new Paquete(
      getNextId('paquetes'),
      datosPaquete.nombre,
      datosPaquete.descripcion,
      datosPaquete.precio,
      datosPaquete.diasEntrega
    );

    gig.agregarPaquete(nuevoPaquete);
    await gigRepository.save(gig);
    return await this.#_construirGigDTO(gig);
  }

  async eliminarPaquete(gigId, paqueteId, vendedorId) {
    const gig = await gigRepository.findById(parseInt(gigId));
    if (!gig) throw new NotFoundError('Gig no encontrado');
    if (gig.vendedorId !== vendedorId) throw new ForbiddenError('No sos el dueño de este Gig');

    if (gig.paquetes.length === 1) {
      throw new BadRequestError('El Gig debe tener al menos un paquete');
    }

    gig.eliminarPaquete(parseInt(paqueteId));
    await gigRepository.save(gig);
    return await this.#_construirGigDTO(gig);
  }

  async agregarMultimedia(gigId, url, vendedorId) {
    const gig = await gigRepository.findById(parseInt(gigId));
    if (!gig) throw new NotFoundError('Gig no encontrado');
    if (gig.vendedorId !== vendedorId) throw new ForbiddenError('No sos el dueño de este Gig');

    if (!url) throw new BadRequestError('La URL es obligatoria');

    gig.agregarMultimedia(url);
    await gigRepository.save(gig);
    return await this.#_construirGigDTO(gig);
  }

  async eliminarMultimedia(gigId, url, vendedorId) {
    const gig = await gigRepository.findById(parseInt(gigId));
    if (!gig) throw new NotFoundError('Gig no encontrado');
    if (gig.vendedorId !== vendedorId) throw new ForbiddenError('No sos el dueño de este Gig');

    gig.eliminarMultimedia(url);
    await gigRepository.save(gig);
    return await this.#_construirGigDTO(gig);
  }

  // --- Helpers Privados ---
  async #_construirGigDTO(gig) {
    const categoria = await categoriaRepository.findById(gig.categoriaId);
    const vendedor = await usuarioRepository.findById(gig.vendedorId);
    const opiniones = await opinionRepository.findAllByGigId(gig.id);

    return {
      ...gig,
      categoria: categoria ? { id: categoria.id, nombre: categoria.nombre } : null,
      vendedor: vendedor ? { id: vendedor.id, nombre: vendedor.nombre, apellido: vendedor.apellido } : null,
      cantidadOpiniones: opiniones.length
    };
  }
}

export const gigService = new GigService();
