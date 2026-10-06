# Multi-stage production build for LinguaGuard Node/Express web app
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/src/lib ./src/lib
COPY --from=builder /app/src/types ./src/types

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]
