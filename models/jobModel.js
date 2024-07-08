const mongoose = require("mongoose");

const sequenceSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Define Sequence model
const Sequence = mongoose.model("Sequence", sequenceSchema);

// Define Job Schema
const jobSchema = new mongoose.Schema({
  jobcardnumber: {
    type: Number,
    unique: true, // Ensures uniqueness of job card numbers
    index: true,
  },
  clientname: {
    type: String,
    required: true,
  },
  jobname: {
    type: String,
    required: true,
  },
  invoiceno: {
    type: String,
    required: false,
  },
  salescoordinator: {
    type: String,
    required: false,
  },
  designer: {
    type: String,
    required: false,
  },
  productionsupervisor: {
    type: String,
    required: false,
  },
  printername: {
    type: String,
    required: false,
  },
  sitecoordinator: {
    type: String,
    required: false,
  },
  installationteam: {
    type: String,
    required: false,
  },
  sitelocation: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  additionalinfo: {
    type: String,
    required: false,
  },
  reprintinfo: {
    type: String,
    required: false,
  },
  jobstatus: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
  createdBy: {
    type: String,
    default: "admin",
  },
  editedBy: {
    type: String,
    default: "admin",
  },
});

// Increment job card number before saving the Job document
jobSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      // If the document is not new, do nothing
      return next();
    }

    const lastJob = await this.constructor
      .findOne()
      .sort({ jobcardnumber: -1 });
    this.jobcardnumber = lastJob ? lastJob.jobcardnumber + 1 : 1;

    next();
  } catch (error) {
    next(error);
  }
});

// Define Job model
const Job = mongoose.model("Job", jobSchema);

module.exports = { Job, Sequence };
