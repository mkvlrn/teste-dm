FROM node:alpine AS builder

WORKDIR /src
COPY package*.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY internal/ ./internal/
COPY turbo.json ./
RUN npm pkg delete scripts.prepare
RUN npm ci
RUN npm i lightningcss
COPY apps/frontend ./apps/frontend
RUN npx turbo build

FROM nginx:alpine AS final

WORKDIR /app
COPY ./nginx-frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/apps/frontend/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
