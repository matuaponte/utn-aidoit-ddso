import { z } from "zod";
import { EstadoPedido } from "../models/EstadoPedido.js";

export const crearPedidoSchema = z.object({
  gigId: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  paqueteId: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  requerimientos: z.string().optional()
});

export const cambiarEstadoSchema = z.object({
  nuevoEstado: z.enum(EstadoPedido)
});

export const enviarMensajeSchema = z.object({
  mensaje: z.string().min(1, 'El campo mensaje es obligatorio')
});
