FROM node:alpine AS builder

WORKDIR /src
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY internal/ ./internal/
COPY turbo.json ./turbo.json
RUN npm pkg delete scripts.prepare
RUN npm ci
WORKDIR /src
COPY apps/backend ./apps/backend
WORKDIR /src/apps/backend
RUN npx prisma generate
WORKDIR /src
RUN npx turbo build

FROM node:alpine AS final

WORKDIR /app
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/apps/backend/package.json ./apps/backend/
COPY --from=builder /src/node_modules/@repo ./node_modules/@repo
COPY --from=builder /src/internal/ ./internal/
RUN npm ci --omit=dev --workspace=apps/backend
COPY --from=builder /src/apps/backend/build ./apps/backend/build
COPY --from=builder /src/apps/backend/src/generated/prisma/*.node ./apps/backend/build/generated/prisma/

CMD ["sh", "-c", "node /app/apps/backend/build/shared/utils/reset.js && node /app/apps/backend/build/main.js"]
