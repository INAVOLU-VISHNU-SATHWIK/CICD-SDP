# Build stage
FROM node:18 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Build Vite app (output goes to /app/dist)
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine

# Copy Vite dist folder to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
