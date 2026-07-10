import jwt from 'jsonwebtoken';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { UnauthorizedError } from '../errors/AppError.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'ai-do-it-secret-key-tp-2025';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Token no proporcionado'));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await usuarioRepository.findById(decoded.id);

    if (!usuario) {
      return next(new UnauthorizedError('Usuario no encontrado'));
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.statusCode) {
      return next(error);
    }
    return next(new UnauthorizedError('Token inválido o expirado'));
  }
}
