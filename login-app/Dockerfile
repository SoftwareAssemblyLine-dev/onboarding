# ---- Build Stage: Compile TypeScript ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files definintions 
COPY package*.json ./ 

# Install ALL dependencies (including devDependencies for tsc) 
RUN npm ci 

# Copy source code and config 
COPY tsconfig.json ./
COPY source/ ./source/

# Type-check and compile 
RUN npm run type-check && npm run build 

# ---- Production Stage: Run JavaScript ----
FROM node:20-alpine 

WORKDIR /app 

# Copy compiled output and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "dist/server.js"]
