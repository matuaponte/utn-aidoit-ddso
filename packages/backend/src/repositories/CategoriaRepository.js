export class CategoriaRepository {
  constructor() {
    this.categorias = [];
  }

  findAll() {
    return this.categorias;
  }

  findById(id) {
    return this.categorias.find((c) => c.id === id);
  }

  save(categoria) {
    const index = this.categorias.findIndex((c) => c.id === categoria.id);
    if (index !== -1) {
      this.categorias[index] = categoria;
    } else {
      this.categorias.push(categoria);
    }
  }
}

export const categoriaRepository = new CategoriaRepository();
