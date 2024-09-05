FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN apk add --no-cache bind-tools libc6-compat && \
    yarn global add pnpm && pnpm i


# 2. Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
RUN yarn build

# 3. Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT 3000

RUN apk add --no-cache bind-tools && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/server ./.next/server

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
