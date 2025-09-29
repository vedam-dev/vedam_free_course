# Stage 1: Dependencies - Install dependencies only
FROM node:20-alpine AS deps

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile for reproducible builds
RUN yarn install --frozen-lockfile --production=false

# Stage 2: Builder - Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package.json yarn.lock ./

# Copy source code
COPY . .

# Create .env file from build args (for build-time variables)
# These can be passed via --build-arg or from environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_GA4_MEASUREMENT_ID
ARG GA4_API_SECRET
ARG NEXT_PUBLIC_MSG91_AUTH_KEY
ARG NEXT_PUBLIC_STREAMABLE_USERNAME
ARG NEXT_PUBLIC_STREAMABLE_PASSWORD
ARG NEXT_PUBLIC_MSG91_WIDGET_ID
ARG NEXT_PUBLIC_MONGODB_URI
ARG NEXT_PUBLIC_ADMIN_USERNAME
ARG NEXT_PUBLIC_ADMIN_PASSWORD
ARG NEXT_PUBLIC_GDRIVE

# Create .env.local with fallback values if build args are not provided
RUN echo "NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" >> .env.local && \
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

# Build the application
RUN yarn build


# Stage 3: Production - Create minimal production image
FROM node:20-alpine AS runner

# Install curl for health checks
RUN apk add --no-cache curl

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set the working directory
WORKDIR /app

# Install yarn globally in runner stage
RUN npm install -g yarn

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production=true && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.env.local ./.env.local

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for Next.js
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Command to run the application
CMD ["yarn", "start"]