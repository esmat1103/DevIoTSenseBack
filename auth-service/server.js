const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use('/auth', authRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const port =  3389;
server.listen(port, () => {
  console.log(`Authservice is running on port ${port}`);
});

module.exports = { wss }; 