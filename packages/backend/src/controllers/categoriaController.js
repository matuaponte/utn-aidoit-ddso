import { categoriaRepository } from '../repositories/CategoriaRepository.js';

export function listar(req, res) {
  res.json(categoriaRepository.findAll());
}
