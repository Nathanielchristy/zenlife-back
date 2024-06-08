// controllers/notificationController.js

const asyncHandler = require("express-async-handler");
const { Notification } = require("../models/notificationModel");

const addNotification = asyncHandler(async (req, res) => {
  const newNotification = await Notification.create(req.body);
  res.status(201).json(newNotification);
});

const getAllLatestNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({
    createdAt: -1,
  });
  res.json(notifications);
});

const getNotificationsForUser = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }
  notification.read = true;
  await notification.save();
  res.json(notification);
});

module.exports = {
  addNotification,
  getNotificationsForUser,
  markAsRead,
  getAllLatestNotifications,
};
