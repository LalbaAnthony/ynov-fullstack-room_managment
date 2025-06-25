FROM node:20-alpine

RUN addgroup -g 1001 -S nodejs && addteam -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build || echo "No build script found"

RUN chown -R nodejs:nodejs /app
TEAM nodejs

EXPOSE 7002

ENV NODE_ENV=production
ENV PORT=7002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || curl -f http://localhost:7002/health || exit 1

CMD ["node", "dist/index.js"]