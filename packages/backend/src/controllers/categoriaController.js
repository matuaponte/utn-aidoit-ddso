import { categoriaRepository } from '../repositories/CategoriaRepository.js';

export async function listar(req, res, next) {
  try {
    res.json(await categoriaRepository.findAll());
  } catch (error) {
    next(error);
  }
}
