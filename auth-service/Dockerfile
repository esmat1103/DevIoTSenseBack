# Dockerfile for authservice
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3389

# Start the service
CMD [ "node", "server.js" ]
