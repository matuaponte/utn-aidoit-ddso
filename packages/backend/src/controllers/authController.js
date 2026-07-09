import { authService } from '../services/AuthService.js';

export function login(req, res) {
  const result = authService.login(req.body.email, req.body.password);
  res.json(result);
}

export function register(req, res) {
  const result = authService.register(
    req.body.nombre,
    req.body.apellido,
    req.body.email,
    req.body.password
  );
  res.status(201).json(result);
}

export function getMe(req, res) {
  const { password, ...usuarioSinPassword } = req.usuario;
  res.json(usuarioSinPassword);
}
