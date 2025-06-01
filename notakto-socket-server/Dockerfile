# Use an official Node.js image
FROM mhart/alpine-node

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose WebSocket server port
EXPOSE 8000

# Start the WebSocket server
CMD ["node", "livematch.js"]
