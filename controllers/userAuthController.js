const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register User

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
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
  });

  //Generate Token
  const token = generateToken(user._id, user.email, user.role);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    // expires: "1h",
    sameSite: "none",
    secure: true,
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
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    //validate request
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User Not found please signup");
    }
    // Check password
    const passwordIscorrect = await bcrypt.compare(password, user.password);
    //Generate Token
    const token = generateToken(user._id, user.email, user.role);

    //Send HTTP-only cookie
    // console.log(user && passwordIscorrect);
    if (user && passwordIscorrect) {
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite: "none",
        secure: true,
      });
      const { _id, name, email, photo, phone, empid, role } = user;

      res.status(201).json({
        _id,
        name,
        email,
        photo,
        phone,
        empid,
        token,
        role,
      });
    } else {
      console.log("Error");
      res.status(400);
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

//LogOut User

const logoutUser = asyncHandler(async (req, res) => {
  //Send HTTP-only cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //Expire cookie
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully logout" });
});

//Fetch user data

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, photo, phone, empid, role } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      empid,
      role,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// Check login

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  // console.log(token);

  if (!token) {
    return res.json({ isLoggedIn: false });
  }

  try {
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ isLoggedIn: true });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.json({ isLoggedIn: false, message: "Token expired" });
    }
    return res.json({ isLoggedIn: false, message: "Token invalid" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
};
