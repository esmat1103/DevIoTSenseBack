//userservice/server.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const cors = require('cors');
const path = require('path');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/users', userRoutes);

const port = 3008;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });
app.locals.wss = wss;

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on port ${port}`);