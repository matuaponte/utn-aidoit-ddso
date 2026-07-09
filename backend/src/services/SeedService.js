import bcrypt from 'bcryptjs';
import { Usuario } from '../models/Usuario.js';
import { Categoria } from '../models/Categoria.js';
import { Gig } from '../models/Gig.js';
import { Paquete } from '../models/Paquete.js';
import { Pedido } from '../models/Pedido.js';
import { CambioEstadoPedido } from '../models/CambioEstadoPedido.js';
import { EstadoPedido } from '../models/EstadoPedido.js';
import { Mensaje } from '../models/Mensaje.js';

import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { categoriaRepository } from '../repositories/CategoriaRepository.js';
import { gigRepository } from '../repositories/GigRepository.js';
import { pedidoRepository } from '../repositories/PedidoRepository.js';
import { opinionRepository } from '../repositories/OpinionRepository.js';

let seedExecuted = false;

export class SeedService {
  execute() {
    if (seedExecuted) {
      return { status: 'already_seeded', message: 'La base de datos ya fue poblada.' };
    }

    // Categorias
    categoriaRepository.save(new Categoria(1, 'Desarrollo', 'Servicios de programación y desarrollo de software'));
    categoriaRepository.save(new Categoria(2, 'Diseño', 'Servicios de diseño gráfico, UI/UX e ilustración'));
    categoriaRepository.save(new Categoria(3, 'Marketing', 'Servicios de marketing digital y redes sociales'));
    categoriaRepository.save(new Categoria(4, 'Redacción', 'Servicios de escritura, traducción y contenido'));

    const passwordHasheado = bcrypt.hashSync('123456', 8);

    // Usuarios
    usuarioRepository.save(new Usuario(1, 'Juan', 'Pérez', 'juan@mail.com', passwordHasheado));
    usuarioRepository.save(new Usuario(2, 'María', 'García', 'maria@mail.com', passwordHasheado));
    usuarioRepository.save(new Usuario(3, 'Carlos', 'López', 'carlos@mail.com', passwordHasheado));

    // Gigs
    gigRepository.save(new Gig(
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
    ));

    gigRepository.save(new Gig(
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
    ));

    const ahora = new Date();
    const haceTresDias = new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000);
    const haceDosDias = new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Pedidos
    pedidoRepository.save(new Pedido(
      1, 1, 1, 1, 50,
      'Logo para mi cafetería "El Buen Café". Colores cálidos, estilo minimalista.',
      [
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, 1, haceTresDias),
        new CambioEstadoPedido(EstadoPedido.CONFIRMADO, 2, haceDosDias),
      ],
      [
        new Mensaje(1, 1, 'Hola María, me gustaría un logo minimalista.', haceTresDias),
        new Mensaje(2, 2, '¡Hola Juan! Me encanta el proyecto, ya empiezo.', haceDosDias),
      ]
    ));

    pedidoRepository.save(new Pedido(
      2, 1, 2, 4, 150,
      'Landing page para cafetería con menú, ubicación y contacto.',
      [
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, 1, ahora),
      ],
      []
    ));

    seedExecuted = true;
    return { status: 'success', message: 'Datos sembrados correctamente.' };
  }
}

export const seedService = new SeedService();
