# syntax=docker/dockerfile:1

# ---------- deps: install node_modules with lockfile ----------
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ---------- builder: compile the Next.js app ----------
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars must exist at build time (inlined into the client bundle).
# Defaulted here because an empty string breaks SITE_CONFIG.url ("" is not
# caught by the ?? fallback and fails URL parsing during static generation).
ARG NEXT_PUBLIC_SITE_URL=https://raihanmd.xyz
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN bun run build

# ---------- runner: minimal runtime image ----------
# Payload 3 requires Node ^18.20.2 || >=20.9.0. Alpine (musl) matches the
# builder's ABI so native deps (sharp) don't need a separate build.
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
