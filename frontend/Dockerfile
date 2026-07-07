# --- STAGE 1: Build Vue Application ---
FROM node:18-alpine AS build-stage
WORKDIR /app

# Ensure we are explicitly copying package files from the build context root
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: Serve via Nginx ---
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]