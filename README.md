# AI Do It - Plataforma de Servicios Freelance 🚀

**AI Do It** es una plataforma móvil desarrollada en **React Native (Expo)** con un Backend en **Node.js + Express**. Inspirada en el modelo de plataformas como Fiverr, permite a freelancers publicar servicios ("Gigs") paquetizados y a clientes buscar, contratar, gestionar pedidos y dejar opiniones.

---

## Arquitectura del Sistema

El proyecto está diseñado bajo una estricta **Arquitectura de capas** en el backend y de **Cliente Independiente (Standalone)** en el frontend.

### Backend (Node.js + Express)
1. **Controladores (Controllers):** Punto de entrada. Valida parámetros HTTP y delega al servicio.
2. **Servicios (Services):** Contiene los Casos de Uso. Orquesta repositorios y entidades.
3. **Repositorios (Repositories):** Capa de acceso a datos que abstrae las variables en memoria.
4. **Dominio (Models):** Entidades ricas con lógica de negocio pura.

### Frontend (React Native + Expo)
- **Flujo Unidireccional:** Renderizado reactivo basado en el estado (React Hooks, React Query).
- **Componentización:** UI modularizada utilizando `react-native-paper` (Skeletons, EmptyStates, OrderTimeline).
- **Accesibilidad (WCAG AA):** Cumplimiento de estándares con contrastes de color dinámicos, `accessibilityLabels` en llamadas a la acción críticas y manejo explícito de feedback visual.

---

## 🛠 Instalación y Ejecución

Al ser un monorepo, el proyecto se divide en `packages/frontend` y `packages/backend`.

### 1. Iniciar el Backend
```bash
cd packages/backend
npm install
npm run dev
```
El servidor correrá en el puerto `3000` con datos iniciales (Seed) pre-cargados.

### 2. Iniciar el Frontend
En una nueva terminal:
```bash
cd packages/frontend
npm install
npx expo start
```
Escanea el código QR desde la app **Expo Go** (Android/iOS).