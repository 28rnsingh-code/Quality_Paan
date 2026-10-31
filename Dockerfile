# Multi-stage production container for Google Cloud Run (Free Tier)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy full application source
COPY . .

# Build Vite client production bundle
RUN npm run build

# Remove development dependencies to keep container slim
RUN npm prune --production

# Expose default Cloud Run port (Cloud Run injects PORT env var, defaults to 8080/3000)
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start server using tsx
CMD ["npx", "tsx", "server.ts"]
