# ---- Backend: API Express ----
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala solo dependencias de producción (aprovecha la cache de capas)
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el código fuente
COPY src ./src

# Variables por defecto (sobrescribibles en runtime / docker-compose)
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Healthcheck simple contra el endpoint /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "src/server.js"]
