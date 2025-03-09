# Stage 1: Build Stage
FROM node:current-alpine AS build

# Set working directory
WORKDIR /usr/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# # run migration
# RUN npm run migrate:up

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

RUN npm prune --production

# Stage 2: Production Stage
FROM node:current-alpine AS production

# Set working directory
WORKDIR /usr/app

# Copy built application and dependencies from the build stage
COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/node_modules ./node_modules
COPY package*.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 8093

# Start the application
CMD ["node", "dist/server.js"]