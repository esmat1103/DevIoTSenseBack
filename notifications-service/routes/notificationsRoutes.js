// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { sendNotification } = require('../websocket');
const { getNotifications, getUnreadNotifications, markNotificationsAsRead, getSuperadminIds, handleAction,getNotificationStatus   } = require('../controllers/notificationController');

router.post('/notify', async (req, res) => {
  try {
    const { role, userId, message, type, timestamp, title, read } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message must be provided.' });
    }

    await sendNotification(role, userId, message, type, timestamp, title, read);

    res.status(200).json({ success: true, message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Error sending notification.' });
  }
});

router.post('/notify/superadmins', async (req, res) => {
  try {
    const { message, type, timestamp, title, read } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message must be provided.' });
    }

    const superadminIds = await getSuperadminIds();
    const notificationIds = [];

    for (const userId of superadminIds) {
      const ids = await sendNotification('superadmin', userId, message, type, timestamp, title, read);
      notificationIds.push(...ids.notificationIds);  
    }

    res.status(200).json({ success: true, message: 'Notification sent to all superadmins successfully.', notificationIds }); 
  } catch (error) {
    console.error('Error sending notification to superadmins:', error);
    res.status(500).json({ error: 'Error sending notification to superadmins.' });
  }
});


router.post('/notify/action', async (req, res) => {
  try {
    const { role, userId, message, type, timestamp, title, read, actionRequired, actionDetails, actionStatus } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message must be provided.' });
    }

    await sendNotification(role, userId, message, type, timestamp, title, read, actionRequired, actionDetails, actionStatus);

    res.status(200).json({ success: true, message: 'Action notification sent successfully.' });
  } catch (error) {
    console.error('Error sending action notification:', error);
    res.status(500).json({ error: 'Error sending action notification.' });
  }
});

router.post('/notify/action/superadmins', async (req, res) => {
  try {
    const { message, type, timestamp, title, read, actionRequired, actionDetails, actionStatus } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message must be provided.' });
    }

    const superadminIds = await getSuperadminIds();
    const notificationIds = [];

    for (const userId of superadminIds) {
      const ids = await sendNotification('superadmin', userId, message, type, timestamp, title, read, actionRequired, actionDetails, actionStatus);
      notificationIds.push(...ids.notificationIds);  
    }

    res.status(200).json({ success: true, message: 'Notification sent to all superadmins successfully.', notificationIds }); 
  } catch (error) {
    console.error('Error sending notification to superadmins:', error);
    res.status(500).json({ error: 'Error sending notification to superadmins.' });
  }
});

router.get('/user/:userId', getNotifications);
router.get('/user/:userId/notifications/unread', getUnreadNotifications);
router.patch('/user/:userId/notifications', markNotificationsAsRead);

router.patch('/notifications/action', handleAction);
router.get('/notifications/:notificationId/status', getNotificationStatus);

module.exports = router;
