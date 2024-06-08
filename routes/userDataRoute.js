const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  listUsers,
  createUser,
  deleteUser,
  getUserRole,
} = require("../controllers/userDataController");
const protect = require("../middleware/authMiddleware");
// Fetch user data
router.get("/", protect, listUsers);
router.get("/:id", protect, getUser);
router.post("/", protect, createUser);

// Update user data
router.patch("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;
