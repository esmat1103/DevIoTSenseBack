const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors'); 
const { initWebSocket } = require('./websocket');
const notificationRoutes = require('./routes/notificationsRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000' 
}));

app.use(express.json());
app.use('/api', notificationRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

initWebSocket(server);

const PORT = 3010;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
