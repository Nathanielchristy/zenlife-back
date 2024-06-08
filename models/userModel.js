const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Enter a valid Email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be upto 6 character"],
      //   maxLength: [23, "Password must not be more than 23 character"],
    },
    photo: {
      type: String,
      // required: [true, "Please add a photo"],
      default: "https://i.imgur.com/xG470Sm.png",
    },
    phone: {
      type: String,
      default: "+971",
    },
    role: { type: String, required: [true, "Please Select Role"] },
    empid: {
      type: String,
      maxLength: [250, "emp id must be greater than 250 Characters"],
      default: "EMP",
    },
  },
  {
    timestamps: true,
  }
);

//Encrypt the password before DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
