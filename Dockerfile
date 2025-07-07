# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install yarn globally (alpine image doesn't come with yarn by default)
RUN npm install -g yarn

# Copy package files and install dependencies
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copy the rest of the app (including .env)
COPY . .

# Set build-time environment variables from .env file
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
RUN yarn build

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

# Install yarn globally in runner stage
RUN npm install -g yarn

# Copy built files (excluding .env)
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["yarn", "start"]