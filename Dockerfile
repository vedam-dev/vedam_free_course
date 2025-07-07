# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app (including .env)
COPY . .

# Set build-time environment variables from .env file
# (Using `export` ensures they are available during `npm run build`)
RUN set -a && . ./.env && set +a && \
    echo "NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" > .env.local && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}" >> .env.local && \
    echo "NEXT_PUBLIC_GA4_MEASUREMENT_ID=${NEXT_PUBLIC_GA4_MEASUREMENT_ID}" >> .env.local && \
    echo "NEXT_PUBLIC_MSG91_AUTH_KEY=${NEXT_PUBLIC_MSG91_AUTH_KEY}" >> .env.local && \
    echo "NEXT_PUBLIC_MSG91_WIDGET_ID=${NEXT_PUBLIC_MSG91_WIDGET_ID}" >> .env.local && \
    echo "NEXT_PUBLIC_STREAMABLE_USERNAME=${NEXT_PUBLIC_STREAMABLE_USERNAME}" >> .env.local && \
    echo "NEXT_PUBLIC_STREAMABLE_PASSWORD=${NEXT_PUBLIC_STREAMABLE_PASSWORD}" >> .env.local && \
    echo "NEXT_PUBLIC_MONGODB_URI=${NEXT_PUBLIC_MONGODB_URI}" >> .env.local && \
    echo "GA4_API_SECRET=${GA4_API_SECRET}" >> .env.local && \
    echo "NEXT_PUBLIC_ADMIN_USERNAME=${NEXT_PUBLIC_ADMIN_USERNAME}" >> .env.local && \
    echo "NEXT_PUBLIC_ADMIN_PASSWORD=${NEXT_PUBLIC_ADMIN_PASSWORD}" >> .env.local && \
    echo "NEXT_PUBLIC_GDRIVE=${NEXT_PUBLIC_GDRIVE}" >> .env.local

# Build the app
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built files (excluding .env)
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Runtime environment variables will be injected via `docker run -e` or orchestration
# (No .env.local here to avoid hardcoding secrets in the image)

EXPOSE 3000

CMD ["npm", "run", "start"]