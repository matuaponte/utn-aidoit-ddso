export class UsuarioRepository {
  constructor() {
    this.usuarios = [];
  }

  async findAll() {
    return this.usuarios;
  }

  async findById(id) {
    return this.usuarios.find((u) => u.id === id);
  }

  async findByEmail(email) {
    return this.usuarios.find((u) => u.email === email);
  }

  async save(usuario) {
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
