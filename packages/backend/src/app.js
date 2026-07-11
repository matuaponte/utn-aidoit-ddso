import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { seedService } from './services/SeedService.js';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorLogger } from './middleware/errorLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/seed', seedRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensaje: 'AI Do It Backend funcionando correctamente' });
});

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`\n🚀 AI Do It Backend corriendo en http://localhost:${PORT}`);
  
  // Poblar automáticamente la base en memoria al iniciar
  try {
    await seedService.execute();
    console.log('✅ Base de datos en memoria poblada automáticamente (Seed).');
  } catch (error) {
    console.error('❌ Error al ejecutar el seed inicial:', error);
  }

  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST   /api/seed`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   GET    /api/usuarios/me`);
  console.log(`   PUT    /api/usuarios/me`);
  console.log(`   GET    /api/categorias`);
  console.log(`   GET    /api/gigs`);
  console.log(`   GET    /api/gigs/:id`);
  console.log(`   POST   /api/gigs`);
  console.log(`   GET    /api/gigs/:gigId/opiniones`);
  console.log(`   GET    /api/pedidos`);
  console.log(`   GET    /api/pedidos/:id`);
  console.log(`   POST   /api/pedidos`);
  console.log(`   PATCH  /api/pedidos/:id/estado`);
  console.log(`   GET    /api/pedidos/:pedidoId/mensajes`);
  console.log(`   POST   /api/pedidos/:pedidoId/mensajes`);
  console.log(`   POST   /api/pedidos/:pedidoId/opinion\n`);
});
