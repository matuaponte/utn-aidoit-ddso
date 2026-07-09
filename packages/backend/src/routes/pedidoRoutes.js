import express from 'express';
import { listar, obtenerPorId, crear, cambiarEstado } from '../controllers/pedidoController.js';
import { listar as listarMensajes, enviar as enviarMensaje } from '../controllers/mensajeController.js';
import { crear as crearOpinion } from '../controllers/opinionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', listar);
router.get('/:id', obtenerPorId);
router.post('/', crear);
router.patch('/:id/estado', cambiarEstado);

router.get('/:pedidoId/mensajes', listarMensajes);
router.post('/:pedidoId/mensajes', enviarMensaje);

router.post('/:pedidoId/opinion', crearOpinion);

export default router;
