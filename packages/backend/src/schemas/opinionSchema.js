import { z } from "zod";

export const crearOpinionSchema = z.object({
  puntuacion: z.number().int().min(1).max(5),
  detalle: z.string().min(1, 'El detalle es obligatorio')
});
