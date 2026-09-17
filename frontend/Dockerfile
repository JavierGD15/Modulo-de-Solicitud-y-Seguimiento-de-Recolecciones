# ---- Etapa 1: build de la SPA ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Variables de build de Vite (se "hornean" en el bundle).
# Se pueden sobrescribir con --build-arg o desde docker-compose.
ARG VITE_API_BASE_URL=http://localhost:4000
ARG VITE_API_KEY=cargo-express-demo-key-2026
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_KEY=$VITE_API_KEY

RUN npm run build

# ---- Etapa 2: servir con Nginx ----
FROM nginx:alpine

# Configuración para una SPA (fallback a index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
