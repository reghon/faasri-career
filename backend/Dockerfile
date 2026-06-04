# Stage 1: Build
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN cd backend && pnpm install --frozen-lockfile

COPY backend/tsconfig.json ./backend/
COPY backend/app ./backend/app

RUN cd backend && pnpm run build

# Stage 2: Production
FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN cd backend && pnpm install --frozen-lockfile --prod

COPY --from=build /app/backend/dist ./backend/dist
COPY backend/app/db/migrations ./backend/dist/db/migrations

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /app/backend/uploads && chown -R appuser:appgroup /app/backend/uploads

USER appuser

WORKDIR /app/backend

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
