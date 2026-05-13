FROM node:20-alpine

RUN npm i -g pnpm

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Generate Prisma client
RUN cd packages/database && npx prisma generate

# Build backend
RUN cd apps/backend && pnpm build

# Expose port
EXPOSE 3001

# Start
CMD ["node", "apps/backend/dist/main"]
