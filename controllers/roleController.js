const asyncHandler = require("express-async-handler");
const Role = require("../models/roleModel");

const createRole = asyncHandler(async (req, res) => {
  const { title } = req.body;

  // Check if title is provided
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const role = new Role({ title });
  await role.save();
  res.status(201).json(role);
});

const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return res.status(404).json({ error: "Role not found" });
  }
  res.json(role);
});

const updateRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!role) {
    return res.status(404).json({ error: "Role not found" });
  }
  res.json(role);
});

const deleteRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) {
    return res.status(404).json({ error: "Role not found" });
  }
  res.json({ message: "Role deleted successfully" });
});

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
