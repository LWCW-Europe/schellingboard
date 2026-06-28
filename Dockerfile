# Compile native modules (better-sqlite3) against Node's ABI
FROM node:22-bookworm AS deps
WORKDIR /app
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM node:22-bookworm AS builder
WORKDIR /app
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Pass via --build-arg APP_VERSION=$(git describe --tags --always --dirty)
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
ENV BUILD_STANDALONE=1
RUN bun x next build && \
    bun build --target=node --external better-sqlite3 --external bindings \
        scripts/admin.ts --outfile=.next/standalone/scripts/admin.js && \
    sed -i '1s|.*|#!/usr/bin/env node|' .next/standalone/scripts/admin.js && \
    chmod +x .next/standalone/scripts/admin.js

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Standalone output bundles only the required node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Migrations are loaded at runtime relative to process.cwd()
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/data/data.db
# Uploaded files must live on the persistent /data volume
ENV UPLOADS_DIR=/data/uploads

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>r.ok?process.exit(0):process.exit(1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
