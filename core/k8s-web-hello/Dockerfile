# 🧱 Base image: lightweight Node.js on Alpine Linux
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first for optimized caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]