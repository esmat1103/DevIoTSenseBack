require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const unitRoutes = require('./routes/unitsRoutes');

const app = express();
const port = 3004;
const mongoURL = process.env.MONGO_URL ;
console.log('MongoDB URI:', mongoURL);

mongoose.connect(mongoURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  
  });

app.use(cors());
app.use(express.json());

app.use('/units', unitRoutes);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const wss = new WebSocketServer({ server });
app.locals.wss = wss;

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.send('Welcome to the WebSocket server!');
});

console.log(`WebSocket server is running on port ${port}`);

module.exports = {
  wss
};
