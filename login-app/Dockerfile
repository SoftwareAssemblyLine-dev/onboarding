FROM node:20-alpine

WORKDIR /app

# Copy dependency files definintions 
COPY package*.json ./ 

# Install production dependencies only 
RUN npm ci --omit=dev 

# Copy application code and static assets 
COPY source/ ./source/
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "source/server.js"]
