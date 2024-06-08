const JobStatus = require("../models/jobStatusModel");

// Controller function to fetch all job statuses
const listJobStatuses = async (req, res) => {
  try {
    const jobStatuses = await JobStatus.find();
    res.status(200).json(jobStatuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job statuses", error });
  }
};

// Controller function to add a new job status
const addJobStatus = async (req, res) => {
  const { status } = req.body;

  // Check if the status already exists
  const existingStatus = await JobStatus.findOne({ status });
  if (existingStatus) {
    return res.status(400).json({ message: "Job status already exists" });
  }

  try {
    const newJobStatus = new JobStatus({ status });
    await newJobStatus.save();
    res.status(201).json(newJobStatus);
  } catch (error) {
    res.status(500).json({ message: "Error adding job status", error });
  }
};

module.exports = {
  listJobStatuses,
  addJobStatus,
};
