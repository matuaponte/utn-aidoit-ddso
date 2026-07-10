import { z } from "zod";

export const paqueteSchema = z.object({
  nombre: z.string().min(1, 'El nombre del paquete es obligatorio'),
  descripcion: z.string().min(1, 'La descripción del paquete es obligatoria'),
  precio: z.number().nonnegative('El precio debe ser un número positivo'),
  diasEntrega: z.number().int().positive('Los días de entrega deben ser un entero positivo')
});

export const crearGigSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  categoriaId: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  paquetes: z.array(paqueteSchema).min(1, 'Debe incluir al menos un paquete'),
  multimedia: z.array(z.url()).optional().default([])
});

export const urlSchema = z.object({
  url: z.url('El campo url debe ser una URL válida')
});
