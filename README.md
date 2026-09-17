# 📦 Módulo de Solicitud y Seguimiento de Recolecciones

Portal de autoservicio **fullstack** para que los clientes de una empresa de
paquetería puedan **solicitar la recolección** de un paquete a domicilio y
**consultar el estado** de su solicitud mediante un código único, visualizando
el estado actual, la sucursal/hub asignado y el historial cronológico en una
**línea de tiempo horizontal**.

> Prueba técnica · Frontend **React + Vite** · Backend **Node.js + Express** ·
> **Docker** · Documentación **Swagger/OpenAPI**.
> Identidad visual basada en la paleta de [cargoexpreso.com](https://cargoexpreso.com/).

---

## 📑 Tabla de contenido

- [Características](#-características)
- [Stack y arquitectura](#-stack-y-arquitectura)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos](#-requisitos)
- [Puesta en marcha (local)](#-puesta-en-marcha-local)
- [Puesta en marcha con Docker](#-puesta-en-marcha-con-docker)
- [Variables de entorno](#-variables-de-entorno)
- [API: endpoints y cómo probarlos](#-api-endpoints-y-cómo-probarlos)
- [Documentación Swagger](#-documentación-swagger)
- [Estados y reglas de negocio](#-estados-y-reglas-de-negocio)
- [Notificación simulada](#-notificación-simulada)
- [Estructura de datos](#-estructura-de-datos)
- [Decisiones de diseño](#-decisiones-de-diseño-y-patrones)
- [Estrategia de ramas (Git flow)](#-estrategia-de-ramas-git-flow)
- [Uso de IA](#-uso-de-ia)

---

## ✨ Características

- ✅ **Registro** de solicitudes con generación de **código único** (`REC-AAAA-XXXXXXXX`).
- ✅ **Consulta** por código: estado actual, sucursal/hub e **historial cronológico**.
- ✅ **Seguridad por API Key** (header `x-api-key`) en todos los endpoints de la API.
- ✅ **Reglas de negocio**: `404` si el código no existe, `400` si la franja horaria ya pasó.
- ✅ **Validación** de datos (dirección no vacía, peso numérico positivo) en front y back.
- ✅ **Línea de tiempo horizontal** que resalta el estado actual + historial detallado.
- ✅ **Diseño responsivo** (móvil y escritorio).
- ✅ **Notificación simulada** (correo/SMS en consola) al cambiar de estado.
- ✅ **Dockerización** completa con `docker-compose`.
- ✅ **Swagger/OpenAPI** interactivo.
- ✅ **Arquitectura en capas** + patrón Repository.

---

## 🧱 Stack y arquitectura

| Capa      | Tecnología                                             |
| --------- | ------------------------------------------------------ |
| Frontend  | React 18 + Vite, CSS puro (paleta Cargo Express)       |
| Backend   | Node.js 20 + Express, ES Modules                       |
| Datos     | Archivo JSON (patrón Repository, migrable a SQL)       |
| Docs      | Swagger UI + swagger-jsdoc (OpenAPI 3.0)               |
| Deploy    | Docker + Nginx + docker-compose                        |

La API sigue una **arquitectura en capas** con responsabilidades separadas:

```
Cliente (SPA React)
      │  HTTP + x-api-key
      ▼
┌─────────────────────────────────────────────────────────┐
│  Express App                                              │
│                                                           │
│  Routes ──► Middlewares (API Key, validación, errores)    │
│     │                                                     │
│     ▼                                                     │
│  Controller  (adapta HTTP ↔ negocio)                      │
│     │                                                     │
│     ▼                                                     │
│  Service     (lógica de negocio: 404/400, asignación,     │
│     │         historial, notificaciones)                  │
│     ├──────────────► Notification Service (email/SMS sim.) │
│     ▼                                                     │
│  Repository  (persistencia — patrón Repository)           │
│     │                                                     │
│     ▼                                                     │
│  Data (recolecciones.json / sucursales.json)              │
└─────────────────────────────────────────────────────────┘
```

Ver el detalle en [`docs/arquitectura.md`](docs/arquitectura.md).

---

## 📂 Estructura del proyecto

```
.
├── backend/                      # API REST (Express)
│   ├── src/
│   │   ├── config/               # env + constantes (estados, franjas)
│   │   ├── controllers/          # capa HTTP
│   │   ├── services/             # lógica de negocio + notificaciones
│   │   ├── repositories/         # patrón Repository (JSON)
│   │   ├── routes/               # definición de rutas + anotaciones Swagger
│   │   ├── middlewares/          # apiKey, errorHandler, notFound
│   │   ├── validators/           # validación de entrada
│   │   ├── utils/                # AppError, asyncHandler, codeGenerator
│   │   ├── docs/                 # configuración Swagger/OpenAPI
│   │   ├── data/                 # datos precargados (JSON)
│   │   ├── app.js                # ensamblado de la app
│   │   └── server.js             # arranque del servidor
│   ├── Dockerfile
│   └── .env.example
├── frontend/                     # SPA (React + Vite)
│   ├── src/
│   │   ├── api/                  # cliente HTTP de la API
│   │   ├── components/           # Header, RequestForm, TrackSearch, Timeline…
│   │   ├── styles/               # estilos globales + paleta
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
├── docs/                         # diagramas y documentación
│   ├── arquitectura.md
│   ├── estructura-datos.md
│   └── postman_collection.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔧 Requisitos

- **Node.js** ≥ 18 (recomendado 20) y **npm** ≥ 9
- **Docker** y **Docker Compose** (opcional, para la opción con contenedores)

---

## 🚀 Puesta en marcha (local)

### 1) Backend

```bash
cd backend
cp .env.example .env      # crea tu archivo de variables
npm install
npm run dev               # o: npm start
```

La API queda en **http://localhost:4000**
- Health: `GET http://localhost:4000/health`
- Swagger: `http://localhost:4000/api-docs`

### 2) Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La aplicación web queda en **http://localhost:5173**

> El frontend consume la API en `VITE_API_BASE_URL` y envía la `VITE_API_KEY`
> en el header `x-api-key`. Ambos valores están en `frontend/.env`.

---

## 🐳 Puesta en marcha con Docker

Desde la raíz del proyecto:

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: **http://localhost:8080**
- Backend/API: **http://localhost:4000**
- Swagger: **http://localhost:4000/api-docs**

Para detener: `docker compose down`.

---

## 🔐 Variables de entorno

Cada servicio incluye su propio `.env.example`. Cópialo a `.env` antes de ejecutar.

**Backend** (`backend/.env`):

| Variable      | Descripción                                   | Por defecto                    |
| ------------- | --------------------------------------------- | ------------------------------ |
| `PORT`        | Puerto de la API                              | `4000`                         |
| `NODE_ENV`    | Entorno                                        | `development`                  |
| `API_KEY`     | Clave esperada en el header `x-api-key`       | `cargo-express-demo-key-2026`  |
| `CORS_ORIGIN` | Origen permitido por CORS                     | `http://localhost:5173`        |

**Frontend** (`frontend/.env`):

| Variable            | Descripción                          | Por defecto                   |
| ------------------- | ------------------------------------ | ----------------------------- |
| `VITE_API_BASE_URL` | URL base de la API                   | `http://localhost:4000`       |
| `VITE_API_KEY`      | API Key enviada en `x-api-key`       | `cargo-express-demo-key-2026` |

**Raíz** (`.env`, para `docker-compose`): `API_KEY`, `BACKEND_PORT`, `FRONTEND_PORT`, `CORS_ORIGIN`, `VITE_API_BASE_URL`.

---

## 🔌 API: endpoints y cómo probarlos

> **Todos** los endpoints requieren el header `x-api-key`.
> Base URL local: `http://localhost:4000`

### 1. Registrar una solicitud — `POST /api/recolecciones`

```bash
curl -X POST http://localhost:4000/api/recolecciones \
  -H "x-api-key: cargo-express-demo-key-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "direccion": "7a Avenida 1-01, Zona 9, Guatemala",
    "fechaRecoleccion": "2026-12-20",
    "franjaHoraria": "08:00-12:00",
    "pesoAproximado": 4.2,
    "cliente": { "nombre": "Ana Pérez", "email": "ana@example.com", "telefono": "+502 5555-0000" }
  }'
```

Respuesta `201`:

```json
{
  "success": true,
  "message": "Solicitud de recolección registrada correctamente.",
  "data": { "codigo": "REC-2026-XXXXXXXX", "estadoActual": "PENDIENTE_ASIGNACION", "...": "..." }
}
```

### 2. Consultar una solicitud — `GET /api/recolecciones/{codigo}`

```bash
curl http://localhost:4000/api/recolecciones/REC-2026-CARGO002 \
  -H "x-api-key: cargo-express-demo-key-2026"
```

### 3. (Auxiliar) Cambiar estado — `PATCH /api/recolecciones/{codigo}/estado`

Endpoint extra para **demostrar la notificación simulada** al cambiar de estado:

```bash
curl -X PATCH http://localhost:4000/api/recolecciones/REC-2026-CARGO001/estado \
  -H "x-api-key: cargo-express-demo-key-2026" \
  -H "Content-Type: application/json" \
  -d '{ "estado": "RECOLECTOR_EN_CAMINO" }'
```

### Casos de error (cómo probarlos)

| Caso                              | Petición                                                        | Respuesta |
| --------------------------------- | --------------------------------------------------------------- | --------- |
| Sin/errónea API Key               | Cualquier endpoint sin `x-api-key`                              | `401`     |
| Código inexistente                | `GET /api/recolecciones/NO-EXISTE`                              | `404`     |
| Franja horaria ya pasada          | `POST` con `fechaRecoleccion` anterior a hoy                    | `400`     |
| Datos inválidos                   | `POST` con dirección vacía o peso ≤ 0                           | `400` con `details` |

```bash
# 404 — código inexistente
curl -i http://localhost:4000/api/recolecciones/NO-EXISTE -H "x-api-key: cargo-express-demo-key-2026"

# 400 — franja ya pasada
curl -i -X POST http://localhost:4000/api/recolecciones \
  -H "x-api-key: cargo-express-demo-key-2026" -H "Content-Type: application/json" \
  -d '{"direccion":"Calle 1","fechaRecoleccion":"2020-01-01","franjaHoraria":"08:00-12:00","pesoAproximado":2}'

# 401 — sin API key
curl -i http://localhost:4000/api/recolecciones/REC-2026-CARGO001
```

### Solicitudes de prueba precargadas

| Código               | Estado actual            | Sucursal                     |
| -------------------- | ------------------------ | ---------------------------- |
| `REC-2026-CARGO001`  | Pendiente de Asignación  | Hub Metropolitano Zona 4     |
| `REC-2026-CARGO002`  | Recolector en Camino     | Sucursal Central Mixco       |
| `REC-2026-CARGO003`  | Recolectado              | Hub Quetzaltenango           |
| `REC-2026-CARGO004`  | Cancelada                | Sucursal Escuintla           |
| `REC-2026-CARGO005`  | Pendiente de Asignación  | Hub Petén Santa Elena        |
| `REC-2026-CARGO006`  | Recolector en Camino     | Hub Metropolitano Zona 4     |

> También puedes importar la colección de Postman: [`docs/postman_collection.json`](docs/postman_collection.json).

---

## 📖 Documentación Swagger

Con el backend en ejecución:

- **UI interactiva:** http://localhost:4000/api-docs
- **Especificación OpenAPI (JSON):** http://localhost:4000/api-docs.json

En la UI, pulsa **"Authorize"** e introduce la API Key para poder ejecutar las peticiones desde el navegador.

---

## 🔄 Estados y reglas de negocio

Flujo de estados de una solicitud:

```
PENDIENTE_ASIGNACION ─► RECOLECTOR_EN_CAMINO ─► RECOLECTADO
          │
          └─► CANCELADA (en cualquier momento)
```

| Clave                    | Etiqueta                 |
| ------------------------ | ------------------------ |
| `PENDIENTE_ASIGNACION`   | Pendiente de Asignación  |
| `RECOLECTOR_EN_CAMINO`   | Recolector en Camino     |
| `RECOLECTADO`            | Recolectado              |
| `CANCELADA`              | Cancelada                |

**Reglas implementadas:**
- Si el **código no existe** → `404` con mensaje amigable.
- Si la **franja horaria ya pasó** (fecha/hora anterior a la actual) → `400`.
- **Dirección** obligatoria (no vacía) y **peso** numérico **positivo** → `400` con detalle por campo.
- La **sucursal/hub** se asigna automáticamente según la cobertura que coincida con la dirección.

---

## 🔔 Notificación simulada

Cada vez que cambia el estado de una solicitud (al registrarla o vía el endpoint
`PATCH`), el `NotificationService` imprime en consola un mensaje que **simula**
el envío de un correo y un SMS al cliente:

```
──────────────── 📧 NOTIFICACIÓN (EMAIL SIMULADO) ────────────────
  Para:     ana@example.com
  Asunto:   Actualización de tu recolección REC-2026-XXXXXXXX
  Mensaje:  Hola Ana Pérez, tu solicitud REC-2026-XXXXXXXX cambió al estado: "Recolector en Camino".
  ── SMS ──
  A +502 5555-0000: Cargo Express | REC-2026-XXXXXXXX ahora está "Recolector en Camino".
───────────────────────────────────────────────────────────────────
```

---

## 🗃️ Estructura de datos

El detalle del modelo (con diagrama entidad-relación) está en
[`docs/estructura-datos.md`](docs/estructura-datos.md).

Ejemplo de una solicitud:

```json
{
  "codigo": "REC-2026-CARGO002",
  "direccion": "Calzada Roosevelt 22-15, Zona 11, Mixco",
  "fechaRecoleccion": "2026-09-18",
  "franjaHoraria": "12:00-16:00",
  "pesoAproximado": 12.0,
  "estadoActual": "RECOLECTOR_EN_CAMINO",
  "sucursal": { "id": "MIX-01", "nombre": "Sucursal Central Mixco" },
  "cliente": { "nombre": "Carlos Ramírez", "email": "...", "telefono": "..." },
  "historial": [
    { "estado": "PENDIENTE_ASIGNACION", "etiqueta": "Pendiente de Asignación", "fecha": "2026-09-16T14:00:00.000Z", "descripcion": "..." },
    { "estado": "RECOLECTOR_EN_CAMINO", "etiqueta": "Recolector en Camino", "fecha": "2026-09-17T08:30:00.000Z", "descripcion": "..." }
  ],
  "createdAt": "2026-09-16T14:00:00.000Z",
  "updatedAt": "2026-09-17T08:30:00.000Z"
}
```

---

## 🧩 Decisiones de diseño y patrones

- **Arquitectura en capas** (routes → controller → service → repository): cada
  capa tiene una única responsabilidad y es fácil de testear/mantener.
- **Patrón Repository:** la persistencia está aislada tras una interfaz
  (`findAll`, `findByCodigo`, `create`, `update`). Hoy usa un archivo JSON, pero
  migrar a **MySQL/SQL Server** solo requiere crear otra implementación del
  repositorio, **sin tocar la lógica de negocio**.
- **Inyección de dependencias:** el service recibe sus repositorios y el
  notificador por constructor (facilita el mockeo en pruebas).
- **Manejo de errores centralizado:** clase `AppError` + middleware único que
  distingue errores operacionales de bugs y responde con una estructura JSON
  consistente.
- **DTO/mapper:** el modelo de almacenamiento se transforma en un DTO enriquecido
  (etiquetas legibles, catálogo de estados del flujo) para el frontend.
- **Configuración por entorno:** todo el acceso a `process.env` está centralizado
  en `config/env.js` (single source of truth).

---

## 🌿 Estrategia de ramas (Git flow)

El desarrollo se dividió en **fases**, cada una en su *feature branch* con merge
`--no-ff` hacia `develop`:

| Rama                      | Fase                                      |
| ------------------------- | ----------------------------------------- |
| `feature/backend-core`    | API en capas, reglas de negocio, seguridad|
| `feature/api-docs`        | Documentación Swagger/OpenAPI             |
| `feature/frontend`        | SPA React + Vite (formulario, timeline)   |
| `feature/docker`          | Dockerización (Dockerfiles + compose)     |
| `feature/docs-readme`     | README, diagramas y colección Postman     |

```
main ──● (base)
        \
develop  ●──●──●──●──●   (merges de cada feature)
```

---

## 🤖 Uso de IA

Para el desarrollo de esta prueba se utilizó **Claude (Anthropic)** como
asistente de programación, con los siguientes propósitos:

- **Andamiaje (scaffolding)** de la estructura del monorepo y archivos base.
- **Aceleración** de la escritura de código repetitivo (componentes, middlewares,
  documentación Swagger) manteniendo una arquitectura limpia.
- **Redacción** de este README y de la documentación de apoyo.

Todas las decisiones de arquitectura, la lógica de negocio y la verificación
funcional (pruebas de los endpoints y de la interfaz) fueron revisadas y
validadas manualmente.

---

## 📜 Licencia

MIT.
