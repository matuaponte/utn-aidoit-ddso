import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/authMiddleware.js';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../errors/AppError.js';
import { Usuario } from '../models/Usuario.js';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { getNextId } from '../utils/IdGenerator.js';

export class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new BadRequestError('Email y password son obligatorios');
    }

    const usuario = await usuarioRepository.findByEmail(email);

    if (!usuario) {
      throw new NotFoundError('No existe un usuario con ese email');
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      throw new UnauthorizedError('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...usuarioSinPassword } = usuario;
    return { token, usuario: usuarioSinPassword };
  }

  async register(nombre, apellido, email, password) {
    if (!nombre || !apellido || !email || !password) {
      throw new BadRequestError('Todos los campos son obligatorios');
    }

    const existente = await usuarioRepository.findByEmail(email);
    if (existente) {
      throw new ConflictError('Ya existe un usuario con ese email');
    }

    const passwordHasheado = bcrypt.hashSync(password, 8);

    const nuevoUsuario = new Usuario(
      getNextId('usuarios'),
      nombre,
      apellido,
      email,
      passwordHasheado
    );

    await usuarioRepository.save(nuevoUsuario);

    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    return { token, usuario: usuarioSinPassword };
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
      if (!bcrypt.compareSync(passwordActual, usuario.password)) {
        throw new UnauthorizedError('La contraseña actual es incorrecta');
      }
      usuario.password = bcrypt.hashSync(passwordNueva, 8);
    }

    await usuarioRepository.save(usuario);

    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}

export const authService = new AuthService();
