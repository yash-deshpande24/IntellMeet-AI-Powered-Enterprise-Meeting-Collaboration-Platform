# ---------- Stage 1: install production dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---------- Stage 2: small runtime image ----------
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run as the non-root "node" user that ships with the image
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]