# Use a lightweight Node.js image
FROM node:24

# Set working directory
WORKDIR /app

# Install dependencies with caching
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the project (e.g., TypeScript)
RUN pnpm build

# Expose the port used by the application
EXPOSE 3333

# Set production environment
ENV NODE_ENV=production

# Start the application (from built files)
CMD ["pnpm", "start"]