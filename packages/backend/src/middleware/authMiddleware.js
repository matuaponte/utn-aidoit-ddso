import jwt from 'jsonwebtoken';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { UnauthorizedError } from '../errors/AppError.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'ai-do-it-secret-key-tp-2025';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = usuarioRepository.findById(decoded.id);

    if (!usuario) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new UnauthorizedError('Token inválido o expirado');
  }
}
