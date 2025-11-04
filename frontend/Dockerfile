# ==========================
# Etapa de construcción
# ==========================
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Construir el proyecto (salida en /app/build)
RUN npm run build

# ==========================
# Etapa de producción
# ==========================
FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g serve

# Copiar el build resultante
COPY --from=build /app/build ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["serve", "-s", "dist", "-l", "3000"]
