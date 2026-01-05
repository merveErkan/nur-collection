# 1️⃣ Build aşaması
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2️⃣ Serve aşaması (NGINX)
FROM nginx:alpine

# React build dosyalarını nginx'e kopyala
COPY --from=build /app/build /usr/share/nginx/html

# Cloud Run 8080 ister
EXPOSE 8080

# Nginx'i 8080'de çalıştır
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
