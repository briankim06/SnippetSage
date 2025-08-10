# ---- Base Stage (shared) ----
# Use a lightweight Node image as the base for all stages
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Copy dependency manifests first for better layer caching
COPY package*.json ./

# ---- Dependencies Stage ----
# Install all dependencies (including dev-deps) once and reuse
FROM base AS deps
RUN npm ci

# ---- Build Stage ----
# Compile TypeScript → JavaScript
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy production dependencies & compiled output only
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# The API listens on port 5001
EXPOSE 5001

# Run the compiled server
CMD ["node", "dist/server.js"]