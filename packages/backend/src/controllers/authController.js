import { authService } from '../services/AuthService.js';
import { loginSchema, registerSchema } from '../schemas/authSchema.js';

export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    console.log('LOGIN', { email, password });
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const { nombre, apellido, email, password } = registerSchema.parse(req.body);

    const result = await authService.register(nombre, apellido, email, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

