import { AppError } from '../errors/AppError.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: err.timestamp,
    });
  }

  // Manejo global de validaciones de Zod
  if (err.name === 'ZodError') {
    const issues = err.issues || err.errors || JSON.parse(err.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Error de validación de datos',
      errors: issues.map(e => ({ path: e.path ? e.path.join('.') : 'campo', message: e.message })),
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
  });
}
