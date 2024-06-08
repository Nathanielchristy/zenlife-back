const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
} = require("../controllers/roleController");
const protect = require("../middleware/authMiddleware");

// Create a new role
router.post("/", protect, createRole);

// Get all roles
router.get("/", getAllRoles);

// Get a specific role by ID
router.get("/:id", protect, getRoleById);

// Update a role by ID
router.patch("/:id", protect, updateRoleById);

// Delete a role by ID
router.delete("/:id", protect, deleteRoleById);

module.exports = router;
