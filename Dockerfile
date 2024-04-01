FROM node:18.12.0-alpine  as dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build
CMD ["npm","run","dev:docker"]

FROM nginx:latest as prod-stage
COPY --from=dev-stage /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=dev-stage /app/dist/* /usr/share/nginx/html
EXPOSE 80