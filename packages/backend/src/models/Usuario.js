import { BadRequestError } from '../errors/AppError.js';

export class Usuario {
  constructor(id, nombre, apellido, email, password, favoritos = []) {
    if (!nombre || !apellido || !email || !password) {
      throw new BadRequestError('Nombre, apellido, email y password son obligatorios para un Usuario');
    }
    if (!email.includes('@')) {
      throw new BadRequestError('El email debe tener un formato válido');
    }
    if(password.length < 6) throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
    
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.password = password;
    this.favoritos = favoritos;
  }

  agregarFavorito(gigId) {
    if (!this.favoritos.includes(gigId)) {
      this.favoritos.push(gigId);
    }
  }

  removerFavorito(gigId) {
    this.favoritos = this.favoritos.filter(id => id !== gigId);
  }
}
