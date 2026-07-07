# --- STAGE 1: Build Vue Application ---
FROM node:18-alpine AS build-stage
WORKDIR /app

# Copy the package configs from the immediate build engine context
COPY package*.json ./

# Run the installation
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile production build
RUN npm run build

# --- STAGE 2: Serve via Nginx ---
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]