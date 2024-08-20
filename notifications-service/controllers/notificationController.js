const Notification = require('../models/notificationsModel');
const User = require('../models/User');

exports.addNotification = async (req, res) => {
  try {
    const { userIds, role, message, type, timestamp, title, read } = req.body;
    const notificationData = {
      userId: userIds, // Changed to array
      role,
      message,
      type,
      timestamp,
      title,
      read,
    };

    console.log('Notification Data to be saved:', notificationData);

    const notification = new Notification(notificationData);
    await notification.save();

    res.status(201).send({ notificationId: notification._id });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(400).send(error);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.status(200).send(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId, read: false });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getSuperadminIds = async () => {
  try {
    const superadmins = await User.find({ role: 'superadmin' }, '_id');
    return superadmins.map(admin => admin._id);
  } catch (error) {
    console.error('Error fetching superadmin IDs:', error);
    throw error;
  }
};

exports.handleAction = async (req, res) => {
  try {
    const { notificationId, actionStatus } = req.body;

    if (actionStatus && !['approved', 'rejected'].includes(actionStatus)) {
      return res.status(400).json({ error: 'Invalid action status.' });
    }

    const result = await Notification.findByIdAndUpdate(notificationId, { actionStatus }, { new: true });

    if (!result) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).send(error);
  }
};
