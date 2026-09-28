FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
ENV API_URL=/api BACKEND_UPSTREAM=backend:5000
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY runtime/config.js.template /etc/nginx/runtime/config.js.template
COPY --chmod=755 runtime/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
