# [AI Do It 🚀 — Plataforma Mobile de Servicios Freelance —](https://github.com/matuaponte/utn-aidoit-ddso/blob/main/%5BDDS%20UTN%5D%20Trabajo%20Pr%C3%A1ctico%20Individual%20de%20Desarrollo%20con%20IA%20-%201C%202026%20-%20P%C3%BAblico.pdf)

> **Trabajo Práctico Individual — Desarrollo de Software (UTN FRBA)**  
> **Arquitectura:** Cliente-Servidor (Standalone Mobile Paradigm + Node.js Express Backend Multicapa)  
> **Tecnologías:** React Native, Expo Router, Node.js, Express, TanStack React Query, React Native Paper  
> **Estándar de Accesibilidad:** WCAG AA Compliance  

---

## 📌 Descripción del Proyecto

**AI Do It** es una aplicación móvil inspirada en plataformas como *Fiverr*, diseñada para la publicación, contratación y gestión transparente de servicios freelance ("Gigs"). La plataforma conecta dos roles fundamentales de usuario:


- 👤 **Clientes:** Exploran catálogos de servicios, filtran por categorías y búsqueda textual, ordenan por precio/puntaje/fecha, contratan paquetes personalizados especificando requerimientos, mantienen chat en tiempo real dentro del pedido y valoran el trabajo finalizado mediante un sistema de reseñas y puntuación.
- 🛠️ **Freelancers:** Crean y paquetizan sus servicios ofreciendo distintas escalas de alcance/precio (Básico, Estándar, Premium), gestionan el ciclo de vida de los pedidos recibidos, interactúan en el chat del pedido y realizan entregas finales.

---

## 🏛️ Arquitectura del Sistema

El sistema fue diseñado siguiendo un estricto cumplimiento de **Separación de Responsabilidades (SOC)** y el patrón **Standalone Mobile Client**, dividiendo el proyecto en un monorepo limpio con dos paquetes principales: `packages/backend` y `packages/frontend`.

```
                  ┌──────────────────────────────────────────────┐
                  │    React Native + Expo Mobile Client         │
                  │  (React Query, Expo Router, WCAG AA UI)     │
                  └──────────────────────┬───────────────────────┘
                                         │  Async REST API (JSON)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │      Express.js REST Controller Layer        │
                  └──────────────────────┬───────────────────────┘
                                         │  DTOs & Request Validation
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │      Service Layer (Use Cases & Business)    │
                  └──────────────────────┬───────────────────────┘
                                         │  Domain Entities & Rules
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Repository Layer (In-Memory RAM Abstr.)  │
                  └──────────────────────────────────────────────┘
```

### 1. ⚙️ Backend Multicapa (Node.js + Express)
Organizado en 4 capas estrictas para orquestar la lógica sin acoplamiento:

1. **Capa de Dominio (`models/`):** Modelos ricos autocontenidos (`Gig`, `Pedido`, `Usuario`, `Opinion`, `Mensaje`) capaces de validar sus propias invariantes y consistencia interna (ej. re-cálculo automático de puntaje promedio).
2. **Capa de Repositorios (`repositories/`):** Abstracción sobre la persistencia de datos en memoria RAM (`Map` / estructuras en memoria), exponiendo métodos estandarizados (`buscarPorId`, `guardar`, `obtenerTodos`).
3. **Capa de Servicios (`services/`):** Orquestación pura de casos de uso (ej. `PedidoService`, `GigService`, `OpinionService`), coordinando la interacción entre entidades y repositorios sin exponer detalles de transporte HTTP.
4. **Capa de Controladores (`controllers/`):** Puntos de entrada HTTP que parsean parámetros de entrada, realizan validaciones estructurales de payload y devuelven respuestas DTO con códigos de estado HTTP semánticos (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

#### 🛡️ Manejo Centralizado de Errores y Validaciones
- **Excepciones de Dominio Tipificadas:** `ValidationError`, `NotFoundError`, `UnauthorizedError`.
- **Middleware Global de Errores:** Captura centralizada en `middleware/errorHandler.js` que transforma excepciones internas en respuestas JSON seguras y estandarizadas.

---

### 2. 📱 Frontend Mobile (React Native + Expo Router)
Desarrollado bajo el paradigma **Standalone Client** (cliente pesado independiente):

- **Arquitectura de Vistas Reactivas:** Flujo unidireccional de datos con TanStack React Query y Hooks personalizados (`useGigs`, `usePedidos`, `useOpiniones`).
- **Navegación Móvil:** Sistema de rutas dinámicas tipo SPA provisto por **Expo Router** (file-based routing con pantallas modales y pestañas principales `(tabs)`).
- **Accesibilidad (WCAG AA Compliance):**
  - Contraste cromático optimizado para visibilidad en exteriores y modos oscuros/claros.
  - Etiquetas explicativas `accessibilityLabel`, `accessibilityHint` y `accessibilityRole` en todos los componentes interactivos y botones táctiles.
  - Control explícito de foco mediante refs dinámicas para lectores de pantalla.
  - Ausencia de etiquetas HTML (cumplimiento de React Native puro: `<View>`, `<Text>`, `<TouchableOpacity>`, `StyleSheet`).

---

## 📦 Estructura del Proyecto

```
tp-individual-matuaponte/
├── packages/
│   ├── backend/                     # API REST Node.js + Express
│   │   ├── src/
│   │   │   ├── controllers/         # Controladores HTTP (GigController, PedidoController, etc.)
│   │   │   ├── services/            # Lógica de Negocio y Casos de Uso
│   │   │   ├── repositories/        # Abstracción de datos en memoria RAM (Map)
│   │   │   ├── models/              # Entidades de dominio ricas (Gig, Pedido, Usuario, etc.)
│   │   │   ├── data/                # Semilla de datos iniciales (Seed Data)
│   │   │   ├── middleware/          # Handler global de errores y Auth
│   │   │   ├── errors/              # Clases de errores personalizados (ValidationError, etc.)
│   │   │   ├── routes/              # Definición de endpoints REST
│   │   │   ├── schemas/             # Esquemas de validación estructural
│   │   │   └── app.js               # Punto de entrada Express
│   │   └── package.json
│   │
│   └── frontend/                    # App Mobile React Native + Expo
│       ├── app/                     # Rutas y Pantallas Expo Router
│       │   ├── (auth)/              # Autenticación (Login, Registro)
│       │   ├── (tabs)/              # Navegación principal por Pestañas (Gigs, Pedidos, Perfil)
│       │   ├── contacto.jsx
│       │   ├── faq.jsx
│       │   └── _layout.jsx          # Root Layout & Context Providers
│       ├── src/
│       │   ├── api/                 # Cliente Axios configurado (apiClient)
│       │   ├── components/          # Componentes de UI modulares y accesibles
│       │   ├── context/             # Estado global (AuthProvider)
│       │   ├── hooks/               # Custom hooks de React Query
│       │   └── theme/               # Paleta de colores, tipografías y spacing WCAG AA
│       └── package.json
├── README.md
└── package.json
```

---

## ✨ Casos de Uso del Negocio

### 👤 Flujo del Cliente
1. **Exploración de Gigs:** Búsqueda en tiempo real por título/descripción y filtrado dinámico por categorías.
2. **Ordenamiento Avanzado:** Clasificación multicriterio por **precio**, **puntaje promedio** y **fecha de publicación**.
3. **Contratación Paquetizada:** Selección entre paquetes de servicio (*Básico*, *Estándar*, *Premium*) con desglose de entregables y costo.
4. **Especificación de Requerimientos:** Carga de notas y requerimientos específicos al confirmar la orden.
5. **Seguimiento y Chat:** Visualización del estado del pedido (Confirmado, En Proceso, Entregado, Cancelado), cálculo dinámico de días restantes y chat bidireccional en tiempo real.
6. **Cancelación Abierta:** Cancelación del pedido en cualquier momento antes de la entrega final por parte del freelancer.
7. **Feedback y Puntuación:** Emisión de reseña y calificación numérica pos-entrega, re-calculando automáticamente el promedio global del Gig.

### 🛠️ Flujo del Freelancer
1. **Creación de Gigs:** Formulario de alta de servicios con definición flexible de paquetes y precios.
2. **Gestión de Pedidos:** Listado de órdenes recibidas con timeline de estados y días restantes para la entrega.
3. **Comunicación:** Atención de consultas de clientes mediante el chat integrado.
4. **Entrega de Trabajos:** Transición de estados de pedidos hacia la confirmación de entrega final.

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- **Node.js:** `v18.x` o superior
- **npm:** `v9.x` o superior
- **Expo Go App** instalada en tu dispositivo móvil (Android/iOS) o un emulador activo (Android Studio / Xcode).

---

### 1. Iniciar el Backend (Node.js REST API)
En una terminal:
```bash
cd packages/backend
npm install
npm run dev
```
- Servidor ejecutándose en: `http://localhost:3000` (o la IP local expuesta en tu red).
- Semilla de datos (*seeds*) pre-cargada automáticamente en memoria RAM.

---

### 2. Iniciar el Frontend Mobile (React Native + Expo)
En una segunda terminal:
```bash
cd packages/frontend
npm install
npx expo start
```
- Escaneá el código QR resultante desde la app **Expo Go** en tu celular o presiona `a` para abrir el emulador de Android / `i` para iOS.

---

## 🧪 Verificación y Testing de la API (Backend First)

Antes de levantar la interfaz gráfica, podés verificar los endpoints del backend utilizando `cURL`, **Thunder Client** o **Postman**:

#### 📌 Obtener todos los Gigs
```bash
curl -X GET http://localhost:3000/api/gigs
```

#### 📌 Filtrar Gigs por categoría
```bash
curl -X GET "http://localhost:3000/api/gigs?categoria=Desarrollo"
```

#### 📌 Crear un nuevo Pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "gigId": "gig-1",
    "clienteId": "user-2",
    "paquete": "Basico",
    "requerimientos": "Necesito un logo en formato SVG vectorizado"
  }'
```

---

## 👨‍💻 Autor y Universidad

- **Estudiante:** Matias Aponte
- **Materia:** Desarrollo de Software (UTN FRBA)
- **Año:** 2026
