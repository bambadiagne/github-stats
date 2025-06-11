FROM node:18.20.3-alpine  as dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","run","dev:docker"]