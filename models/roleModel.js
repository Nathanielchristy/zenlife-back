const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
