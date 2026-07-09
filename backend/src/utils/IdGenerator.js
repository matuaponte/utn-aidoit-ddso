const counters = {
  usuarios: 10,
  categorias: 10,
  gigs: 10,
  paquetes: 10,
  pedidos: 10,
  mensajes: 10,
  opiniones: 10,
};

export function getNextId(entity) {
  counters[entity] += 1;
  return counters[entity];
}
