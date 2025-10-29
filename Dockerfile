FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY prisma ./prisma
CMD ["node", "dist/main.js"]