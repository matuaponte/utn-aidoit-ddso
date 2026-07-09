import { BadRequestError, NotFoundError, ForbiddenError } from '../errors/AppError.js';
import { Gig } from '../models/Gig.js';
import { Paquete } from '../models/Paquete.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { categoriaRepository } from '../repositories/CategoriaRepository.js';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { opinionRepository } from '../repositories/OpinionRepository.js';
import { getNextId } from '../utils/IdGenerator.js';

export class GigService {
  listarGigs(filtros) {
    const paginatedResult = gigRepository.findWithFiltersAndPagination(filtros);

    // Devolvemos populados manteniendo la metadata de paginación
    return {
      ...paginatedResult,
      data: paginatedResult.data.map(g => this.#_construirGigDTO(g))
    };
  }

  obtenerGigPorId(id) {
    const gig = gigRepository.findById(id);
    if (!gig) {
      throw new NotFoundError('Gig no encontrado');
    }
    return this.#_construirGigDTO(gig);
  }

  crearGig(datos, vendedorId) {
    const { nombre, descripcion, categoriaId, paquetes, multimedia } = datos;

    if (!nombre || !descripcion || !categoriaId) {
      throw new BadRequestError('nombre, descripcion y categoriaId son obligatorios');
    }

    if (!paquetes || !Array.isArray(paquetes) || paquetes.length === 0) {
      throw new BadRequestError('Debe incluir al menos un paquete');
    }

    const categoria = categoriaRepository.findById(parseInt(categoriaId));
    if (!categoria) {
      throw new NotFoundError('Categoría no encontrada');
    }

    const nuevoGig = new Gig(
      getNextId('gigs'),
      nombre,
      descripcion,
      parseInt(categoriaId),
      vendedorId
    );

    // Enriquecemos con los métodos del dominio
    for (const paq of paquetes) {
      nuevoGig.agregarPaquete(new Paquete(
        getNextId('paquetes'),
        paq.nombre,
        paq.descripcion,
        paq.precio,
        paq.diasEntrega
      ));
    }

    if (multimedia && Array.isArray(multimedia)) {
      multimedia.forEach(url => nuevoGig.agregarMultimedia(url));
    }

    gigRepository.save(nuevoGig);
    return this.#_construirGigDTO(nuevoGig);
  }

  // --- Subdominio: Paquetes y Multimedia ---

  agregarPaquete(gigId, datosPaquete, vendedorId) {
    const gig = gigRepository.findById(parseInt(gigId));
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
    gigRepository.save(gig);
    return this.#_construirGigDTO(gig);
  }

  eliminarPaquete(gigId, paqueteId, vendedorId) {
    const gig = gigRepository.findById(parseInt(gigId));
    if (!gig) throw new NotFoundError('Gig no encontrado');
    if (gig.vendedorId !== vendedorId) throw new ForbiddenError('No sos el dueño de este Gig');

    if (gig.paquetes.length === 1) {
      throw new BadRequestError('El Gig debe tener al menos un paquete');
    }

    gig.eliminarPaquete(parseInt(paqueteId));
    gigRepository.save(gig);
    return this.#_construirGigDTO(gig);
  }

  agregarMultimedia(gigId, url, vendedorId) {
    const gig = gigRepository.findById(parseInt(gigId));
    if (!gig) throw new NotFoundError('Gig no encontrado');
    if (gig.vendedorId !== vendedorId) throw new ForbiddenError('No sos el dueño de este Gig');

    if (!url) throw new BadRequestError('La URL es obligatoria');

    gig.agregarMultimedia(url);
    gigRepository.save(gig);
    return this.#_construirGigDTO(gig);
  }

  eliminarMultimedia(gigId, url, vendedorId) {
    const gig = gigRepository.findById(parseInt(gigId));
    if (!gig) throw new NotFoundError('Gig no encontrado');
    if (gig.vendedorId !== vendedorId) throw new ForbiddenError('No sos el dueño de este Gig');

    gig.eliminarMultimedia(url);
    gigRepository.save(gig);
    return this.#_construirGigDTO(gig);
  }

  // --- Helpers Privados ---
  #_construirGigDTO(gig) {
    const categoria = categoriaRepository.findById(gig.categoriaId);
    const vendedor = usuarioRepository.findById(gig.vendedorId);

    return {
      ...gig,
      categoria: categoria ? { id: categoria.id, nombre: categoria.nombre } : null,
      vendedor: vendedor ? { id: vendedor.id, nombre: vendedor.nombre, apellido: vendedor.apellido } : null
    };
  }
}

export const gigService = new GigService();
