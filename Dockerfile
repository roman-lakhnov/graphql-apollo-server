# FROM node:18

# # Create app directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy source code
# COPY . .

# # Expose the port the app runs on
# EXPOSE 4000

# # Command to run the app
# CMD ["npm", "start"]

# ////////////////////////////////////////////

# Этап сборки

FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

# Этап запуска
FROM reg.mini.dev/mini_4amgcnbbvtknt75x5lztb37pswexv6im/node:latest

WORKDIR /usr/src/app
COPY --from=builder /app .

# (по желанию) USER node — если хочешь более безопасно
EXPOSE 4000
CMD ["sh", "-c", "npm start"]


