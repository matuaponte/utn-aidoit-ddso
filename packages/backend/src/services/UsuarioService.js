import bcrypt from 'bcryptjs';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../errors/AppError.js';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';

export class UsuarioService {
  async getProfile(userId) {
    const usuario = await usuarioRepository.findById(userId);
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  async updateProfile(userId, nombre, apellido, passwordActual, passwordNueva) {
    const usuario = await usuarioRepository.findById(userId);
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;

    if (passwordNueva) {
      if (!passwordActual) {
        throw new BadRequestError('Debes ingresar tu contraseña actual para cambiarla');
      }
      const match = await bcrypt.compare(passwordActual, usuario.password);
      if (!match) {
        throw new UnauthorizedError('La contraseña actual es incorrecta');
      }
      usuario.password = await bcrypt.hash(passwordNueva, 8);
    }

    await usuarioRepository.save(usuario);

    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}

export const usuarioService = new UsuarioService();
