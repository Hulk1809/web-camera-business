# Multi-stage Dockerfile for React Admin Portal
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Runner stage with lightweight NGINX Alpine
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
RUN ln -s /usr/share/nginx/html /usr/share/nginx/html/admin
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
