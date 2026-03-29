# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY next-app/package*.json ./next-app/
RUN cd next-app && npm install
COPY . .
RUN cd next-app && npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next-app/.next ./next-app/.next
COPY --from=builder /app/next-app/node_modules ./next-app/node_modules
COPY --from=builder /app/metadata ./metadata
COPY --from=builder /app/next-app/package*.json ./next-app/
COPY --from=builder /app/next-app/public ./next-app/public

EXPOSE 3000
WORKDIR /app/next-app
CMD ["npm", "start"]