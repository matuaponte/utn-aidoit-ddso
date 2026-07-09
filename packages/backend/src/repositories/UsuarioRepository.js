export class UsuarioRepository {
  constructor() {
    this.usuarios = [];
  }

  findAll() {
    return this.usuarios;
  }

  findById(id) {
    return this.usuarios.find((u) => u.id === id);
  }

  findByEmail(email) {
    return this.usuarios.find((u) => u.email === email);
  }

  save(usuario) {
    const index = this.usuarios.findIndex((u) => u.id === usuario.id);
    if (index !== -1) {
      this.usuarios[index] = usuario;
    } else {
      this.usuarios.push(usuario);
    }
  }
}

// Exportamos una única instancia (Singleton) para mantener la memoria viva
export const usuarioRepository = new UsuarioRepository();
