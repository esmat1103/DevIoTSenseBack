FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p /usr/src/app/uploads

RUN mkdir -p /usr/src/app/services/userservice/uploads
RUN chmod -R 777 /usr/src/app/services/userservice/uploads

EXPOSE 3008
CMD ["node", "server.js"]
