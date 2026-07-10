import { usuarioService } from '../services/UsuarioService.js';

export async function getMe(req, res, next) {
  try {
    const result = await usuarioService.getProfile(req.usuario.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { nombre, apellido, passwordActual, passwordNueva } = req.body;
    const result = await usuarioService.updateProfile(req.usuario.id, nombre, apellido, passwordActual, passwordNueva);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
