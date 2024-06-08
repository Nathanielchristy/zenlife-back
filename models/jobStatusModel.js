// models/jobStatusModel.js

const mongoose = require("mongoose");

const jobStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobStatus = mongoose.model("JobStatus", jobStatusSchema);

module.exports = JobStatus;
