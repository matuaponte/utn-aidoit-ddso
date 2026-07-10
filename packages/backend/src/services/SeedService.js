import bcrypt from 'bcryptjs';
import { Usuario } from '../models/Usuario.js';
import { Categoria } from '../models/Categoria.js';
import { Gig } from '../models/Gig.js';
import { Paquete } from '../models/Paquete.js';
import { Pedido } from '../models/Pedido.js';
import { CambioEstadoPedido } from '../models/CambioEstadoPedido.js';
import { EstadoPedido } from '../models/EstadoPedido.js';
import { Mensaje } from '../models/Mensaje.js';
import { Opinion } from '../models/Opinion.js';

import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { categoriaRepository } from '../repositories/CategoriaRepository.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { pedidoRepository } from '../repositories/PedidoRepository.js';
import { opinionRepository } from '../repositories/OpinionRepository.js';

export class SeedService {
  async execute() {
    // Limpiar base de datos en memoria para que el seed sea idempotente y resetee todo
    usuarioRepository.usuarios = [];
    categoriaRepository.categorias = [];
    gigRepository.gigs = [];
    pedidoRepository.pedidos = [];
    opinionRepository.opiniones = [];

    // Categorias
    await categoriaRepository.save(new Categoria(1, 'Desarrollo', 'Servicios de programación y desarrollo de software'));
    await categoriaRepository.save(new Categoria(2, 'Diseño', 'Servicios de diseño gráfico, UI/UX e ilustración'));
    await categoriaRepository.save(new Categoria(3, 'Marketing', 'Servicios de marketing digital y redes sociales'));
    await categoriaRepository.save(new Categoria(4, 'Redacción', 'Servicios de escritura, traducción y contenido'));

    const passwordHasheado = await bcrypt.hash('123456', 8);

    // Usuarios
    await usuarioRepository.save(new Usuario(1, 'Juan', 'Pérez', 'juan@mail.com', passwordHasheado));
    await usuarioRepository.save(new Usuario(2, 'María', 'García', 'maria@mail.com', passwordHasheado));
    await usuarioRepository.save(new Usuario(3, 'Carlos', 'López', 'carlos@mail.com', passwordHasheado));

    // Gigs
    const gigLogo = new Gig(
      1,
      'Diseño de Logo Profesional',
      'Creo logos únicos y modernos para tu marca. Incluyo revisiones y archivos en alta resolución.',
      2, 2,
      [
        new Paquete(1, 'Básico', '1 concepto + 2 revisiones', 50, 3),
        new Paquete(2, 'Estándar', '3 conceptos + 5 revisiones + fuentes', 100, 5),
        new Paquete(3, 'Premium', '5 conceptos + revisiones ilimitadas + branding', 200, 7),
      ],
      ['logo-ejemplo1.jpg', 'logo-ejemplo2.jpg'],
      new Date('2025-06-01')
    );
    await gigRepository.save(gigLogo);

    const gigWeb = new Gig(
      2,
      'Desarrollo Web Full Stack',
      'Desarrollo sitios web completos con React y Node.js. Diseño responsive y código limpio.',
      1, 3,
      [
        new Paquete(4, 'Landing Page', 'Página de aterrizaje responsive', 150, 7),
        new Paquete(5, 'Sitio Completo', 'Sitio web de hasta 5 páginas con panel admin', 500, 14),
      ],
      ['web-ejemplo1.jpg'],
      new Date('2025-06-15')
    );
    await gigRepository.save(gigWeb);

    const gigRedaccion = new Gig(
      3,
      'Redacción SEO y Copywriting',
      'Redacción de artículos optimizados para buscadores. Tránsito orgánico y excelente ortografía.',
      4, 1,
      [
        new Paquete(6, 'Artículo Corto', 'Artículo de 500 palabras optimizado SEO', 20, 2),
        new Paquete(7, 'Artículo Completo', 'Artículo de 1000 palabras + optimización SEO + palabras clave', 40, 4),
      ],
      ['seo-ejemplo1.jpg'],
      new Date('2025-06-20')
    );
    await gigRepository.save(gigRedaccion);

    const ahora = new Date();
    const haceCincoDias = new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000);
    const haceCuatroDias = new Date(ahora.getTime() - 4 * 24 * 60 * 60 * 1000);
    const haceTresDias = new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000);
    const haceDosDias = new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000);
    const haceUnDia = new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000);

    // Pedidos (Juan compra a María - Gig 1) - CONFIRMADO
    await pedidoRepository.save(new Pedido(
      1, 1, 1, 1, 50,
      'Logo para mi cafetería "El Buen Café". Colores cálidos, estilo minimalista.',
      [
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, 1, haceTresDias),
        new CambioEstadoPedido(EstadoPedido.CONFIRMADO, 2, haceDosDias),
      ],
      [
        new Mensaje(1, 1, 'Hola María, me gustaría un logo minimalista.', haceTresDias),
        new Mensaje(2, 2, '¡Hola Juan! Me encanta el proyecto, ya empiezo a bocetarlo.', haceDosDias),
        new Mensaje(3, 1, 'Bárbaro, manteneme al tanto de los avances.', haceUnDia),
      ]
    ));

    // Pedidos (Juan compra a Carlos - Gig 2) - PENDIENTE
    await pedidoRepository.save(new Pedido(
      2, 1, 2, 4, 150,
      'Landing page para cafetería con menú, ubicación y contacto.',
      [
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, 1, ahora),
      ],
      []
    ));

    // Pedidos (María compra a Juan - Gig 3) - ENTREGADO
    const pedidoEntregado = new Pedido(
      3, 2, 3, 6, 20,
      'Artículo sobre tendencias de Inteligencia Artificial para mi blog personal.',
      [
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, 2, haceCincoDias),
        new CambioEstadoPedido(EstadoPedido.CONFIRMADO, 1, haceCuatroDias),
        new CambioEstadoPedido(EstadoPedido.EN_REVISION, 1, haceTresDias),
        new CambioEstadoPedido(EstadoPedido.ENTREGADO, 2, haceDosDias),
      ],
      [
        new Mensaje(4, 2, 'Hola Juan, pasame el artículo por acá cuando lo tengas.', haceCincoDias),
        new Mensaje(5, 1, '¡Listo María! Acá te adjunto el documento final.', haceTresDias),
        new Mensaje(6, 2, '¡Excelente trabajo! Me encantó la redacción.', haceDosDias),
      ]
    );
    await pedidoRepository.save(pedidoEntregado);

    // Pedidos (Carlos compra a Juan - Gig 3) - EN_REVISION
    await pedidoRepository.save(new Pedido(
      4, 3, 3, 7, 40,
      'Guía SEO completa para una tienda e-commerce de indumentaria.',
      [
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, 3, haceTresDias),
        new CambioEstadoPedido(EstadoPedido.CONFIRMADO, 1, haceDosDias),
        new CambioEstadoPedido(EstadoPedido.EN_REVISION, 1, haceUnDia),
      ],
      [
        new Mensaje(7, 3, 'Hola Juan, por favor enfócate en palabras clave de moda sustentable.', haceTresDias),
        new Mensaje(8, 1, 'Entendido, ya está en revisión el borrador.', haceUnDia),
      ]
    ));

    // Pedidos (Carlos compra a María - Gig 1) - CANCELADO
    await pedidoRepository.save(new Pedido(
      5, 3, 1, 2, 100,
      'Diseño de banner publicitario. Necesito entrega urgente.',
      [
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, 3, haceDosDias),
        new CambioEstadoPedido(EstadoPedido.CANCELADO, 2, haceDosDias),
      ],
      [
        new Mensaje(9, 3, 'Hola María, ¿puedes entregarlo hoy mismo?', haceDosDias),
        new Mensaje(10, 2, 'Hola Carlos, lamentablemente no llego por mis tiempos. Cancelo el pedido.', haceDosDias),
      ]
    ));

    // Opiniones
    // Opinión de María para el pedido de Juan (Gig 3 - Redacción SEO)
    const opinion1 = new Opinion(1, 3, 3, 2, 5, 'Muy bien redactado, optimizado y entregado antes de tiempo.');
    await opinionRepository.save(opinion1);

    // Actualizamos promedios
    const opinionesGig3 = await opinionRepository.findAllByGigId(3);
    gigRedaccion.recalcularPuntajePromedio(opinionesGig3);
    await gigRepository.save(gigRedaccion);

    return { status: 'success', message: 'Datos sembrados correctamente.' };
  }
}

export const seedService = new SeedService();
