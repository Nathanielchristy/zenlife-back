const express = require("express");
const router = express.Router();
const {
  addNotification,
  getNotificationsForUser,
  markAsRead,
  getAllLatestNotifications,
} = require("../controllers/notificationController");

// Route to add a new notification
router.post("/", addNotification);

//Route to getall latest notification
router.get("/", getAllLatestNotifications);

// Route to get all notifications for a user
router.get("/:userId", getNotificationsForUser);

// Route to mark a notification as read
router.put("/:id/mark-as-read", markAsRead);

module.exports = router;
