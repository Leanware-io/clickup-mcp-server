FROM node:22.12-alpine AS builder

COPY . /app
WORKDIR /app

# Install dependencies and build TypeScript code
RUN npm ci && npm run build

# Set environment variables
ENV NODE_ENV=production
# ENV CLICKUP_WORKSPACE_ID=123456789

# Run the server
CMD ["node", "dist/index.js"]
