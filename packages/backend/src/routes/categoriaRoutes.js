import express from 'express';
import { listar } from '../controllers/categoriaController.js';

const router = express.Router();

router.get('/', listar);

export default router;
