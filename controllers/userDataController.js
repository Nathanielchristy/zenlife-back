// userController.js

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Fetch all users
const listUsers = asyncHandler(async (req, res) => {
  const condition = { role: { $ne: "admin" } };
  const users = await User.find(condition).select(
    "_id name email photo phone empid token role"
  );
  res.json(users);
});

// Fetch user data by ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select(
    "_id name email photo phone empid role"
  );
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update user data (including role and photo)
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, photo } = req.body;

  const user = await User.findById(id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;
    user.photo = photo || user.photo;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  //Validation
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be upto 6 characters");
  }

  //Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //Create new user

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    const { _id, name, email, photo, phone, empid } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      empid,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ message: "User deleted successfully" });
});

module.exports = {
  listUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
};
