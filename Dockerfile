# Build stage
FROM node:23-slim AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run compile
RUN chown -R 1000:1000 /app 

# Production stage
FROM reg.mini.dev/mini_4amgcnbbvtknt75x5lztb37pswexv6im/node:latest

WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 4000

ENTRYPOINT ["node"]
CMD ["/app/dist/index.js"]


