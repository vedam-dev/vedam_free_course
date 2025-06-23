# Use the official Node.js image with Alpine as the base image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Create .env file from build args (for build-time variables)
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ARG GA4_MEASUREMENT_ID
ARG GA4_API_SECRET
RUN echo "NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}" > .env.local && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}" >> .env.local && \
    echo "NEXT_PUBLIC_GA4_MEASUREMENT_ID=${GA4_MEASUREMENT_ID}" >> .env.local && \
    echo "GA4_API_SECRET=${GA4_API_SECRET}" >> .env.local

# Build the application
RUN npm run build

# Use a smaller image for the final stage
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Create runtime environment variables (these will be injected by Northflank)
# This creates the file structure but leaves it empty - values will come from deployment environment
RUN touch .env.local && \
    chmod +r .env.local

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm","run","start"]