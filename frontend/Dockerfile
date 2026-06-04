# Stage 1: Build
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
RUN cd frontend && pnpm install --frozen-lockfile

COPY frontend/ ./frontend/
RUN cd frontend && npx ng build --configuration production

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/frontend/dist/frontend/browser /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
