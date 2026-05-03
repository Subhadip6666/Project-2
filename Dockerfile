# Simplified Dockerfile for Cloud Run (Single Stage)
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including devDeps needed for 'npm run build')
RUN npm install

# Copy all source files
COPY . .

# Build the React application
RUN npm run build

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Run the production Express server
CMD ["node", "server.js"]
