# FROM node:20-alpine AS base
# FROM node:18-alpine AS base
FROM node:20.19.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install build dependencies and libraries for canvas
RUN apk add --no-cache \
openssl \
bash \
libc6-compat \
python3 \
make \
g++ \
cairo-dev \
pango-dev \
jpeg-dev \
giflib-dev \
curl \
# libcairo \
cairo \
pango \
libjpeg-turbo \
freetype-dev \
vim \
giflib-dev \
&& rm -rf /var/cache/apk/*

WORKDIR /app

RUN echo "Current directory contents:" && ls -la && echo "Current directory:" && pwd
RUN pwd
# ก็อป prisma ไปใน folder in container
COPY prisma . 
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --force ; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi


# FROM base AS builder
FROM deps AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# COPY --from=deps /app/prisma ./prisma
COPY . .
RUN npm i sharp

# local docker database
RUN npx prisma generate

#  build บน local database ก่อน
ARG DATABASE_URL=mysql://root:admin12345@host.docker.internal:3305/vansale_db
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run build


# Production image, copy all the files and run next
# FROM deps AS runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN apk add --no-cache \
    tzdata \ 
    openssl \     
    libc6-compat \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \ 
    cairo \
    pango \
    libjpeg-turbo \
    freetype-dev \
    vim 
    

# standalone
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
RUN chmod -R 777 /app/public

# standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs prisma ./prisma/          
ENV TZ=Asia/Bangkok
RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && echo "Asia/Bangkok" > /etc/timezone

EXPOSE 3000
USER nextjs

# standalone
CMD ["node", "server.js"]

