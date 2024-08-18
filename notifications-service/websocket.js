const socketIo = require('socket.io');
const Notification = require('./models/notificationsModel');
const User = require('./models/User');

let io;

const initWebSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('subscribe', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} subscribed to notifications`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  console.log('WebSocket server initialized');
};

const sendNotification = async (
  role, 
  userId, 
  message, 
  type, 
  timestamp, 
  title, 
  read, 
  actionRequired = null, 
  actionDetails = null, 
  actionStatus = null
) => {
  console.log('Entering sendNotification function'); // Confirm function call

  try {
    const notificationData = {
      role: role || 'user',
      message,
      type,
      timestamp,
      title,
      read
    };

    // Conditionally include optional fields
    if (actionRequired !== null) {
      notificationData.actionRequired = actionRequired;
    }
    if (actionDetails !== null) {
      console.log('Setting actionDetails:', actionDetails);  // Debug log
      notificationData.actionDetails = actionDetails;
    }
    if (actionStatus !== null) {
      notificationData.actionStatus = actionStatus;
    }

    console.log('Notification Data before save:', notificationData);  // Debug log

    const notification = new Notification({ ...notificationData, userId });
    console.log('Notification instance before save:', notification);  // Debug log

    const savedNotification = await notification.save();

    console.log('Saved Notification:', savedNotification);  // Debug log

    // Emit to WebSocket if needed
    if (userId) {
      io.to(userId).emit('notification', savedNotification);
      console.log(`Notification emitted to user: ${userId}`);
    }

    return { notificationIds: [savedNotification._id] };
  } catch (error) {
    console.error('Error sending notifications:', error);
    throw error;
  } finally {
    console.log('Exiting sendNotification function'); // Confirm function exit
  }
};


module.exports = { initWebSocket, sendNotification };
