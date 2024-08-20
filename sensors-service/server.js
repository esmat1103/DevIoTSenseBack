const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();


const sensorsRoutes = require('./routes/sensorsRoutes');
const sensorTypesRoutes = require('./routes/typesRoutes');
const sensorTopicRoutes = require('./routes/sensorTopicRoutes');
const aqualabRoutes = require('./routes/aqualabTopicRoutes');
const pollForChanges = require('./test'); 

const app = express();
const port =  3001; 

const MONGO_URL ="mongodb://host.docker.internal:27017/smartinnov" ;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    pollForChanges()
    })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

app.use(cors());
app.use(express.json());

app.use('/', sensorsRoutes);
app.use('/sensorTypes', sensorTypesRoutes);
app.use('/sensorTopic', sensorTopicRoutes);
app.use('/aqualabTopic', aqualabRoutes); 

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.locals.io = io;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.emit('message', `Server received: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

