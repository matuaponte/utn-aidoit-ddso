import express from 'express';
import { listar, obtenerPorId, crear, agregarPaquete, eliminarPaquete, agregarMultimedia, eliminarMultimedia } from '../controllers/gigController.js';
import { listarPorGig } from '../controllers/opinionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listar);
router.get('/:id', obtenerPorId);
router.get('/:gigId/opiniones', listarPorGig);

router.post('/', authMiddleware, crear);

// Subrecursos (Requieren autenticación y ser el dueño)
router.post('/:id/paquetes', authMiddleware, agregarPaquete);
router.delete('/:id/paquetes/:paqueteId', authMiddleware, eliminarPaquete);

router.post('/:id/multimedia', authMiddleware, agregarMultimedia);
router.delete('/:id/multimedia', authMiddleware, eliminarMultimedia); // Delete usa el body para la URL

export default router;
