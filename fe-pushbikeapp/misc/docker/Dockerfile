# Gunakan Node versi stabil non-alpine
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json dulu untuk caching layer
COPY package*.json ./

# Update npm & install dependencies
RUN npm install -g npm@11.5.2
RUN npm install

# Copy seluruh project
COPY . .

# Build frontend
RUN npm run build

# Expose port dev server
EXPOSE 5173

# Jalankan dev server
CMD ["npm", "run", "dev"]
