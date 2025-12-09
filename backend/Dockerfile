# # backend/Dockerfile
# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 5000
# CMD ["node", "server.js"]
# backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "server.js"]
