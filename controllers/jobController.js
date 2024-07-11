const asyncHandler = require("express-async-handler");
const { Job } = require("../models/jobModel");

const listJobs = asyncHandler(async (req, res) => {
  try {
    // Extract pagination parameters
    let { _start = 0, _end = 10, ...filterParams } = req.query;
    _start = parseInt(_start);
    _end = parseInt(_end);

    // Calculate pageSize
    const pageSize = _end - _start;

    // Define a filter object to hold filter parameters
    const filter = {};

    // Loop through filterParams and add them to the filter object
    // Loop through filterParams and add them to the filter object
    for (const key in filterParams) {
      if (filterParams.hasOwnProperty(key)) {
        let operator = "eq"; // default operator is 'eq'
        if (filterParams[key].operator === "like") {
          filter[key] = { $regex: filterParams[key].value, $options: "i" };
        } else {
          filter[key] = filterParams[key];
        }
      }
    }

    // Retrieve jobs with pagination and additional filtering
    const jobsQuery = Job.find(filter);

    // Apply sorting by createdAt field in descending order (newest first)
    jobsQuery.sort({ createdAt: -1 });

    // Apply pagination
    jobsQuery.skip(_start).limit(pageSize);

    // Execute the query
    const jobs = await jobsQuery.exec();

    // Retrieve total count of jobs
    const totalCount = await Job.countDocuments(filter);

    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    // Send response with jobs and pagination metadata
    res.set("X-Total-Count", totalCount);
    res.json(jobs);
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const viewJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

const addJob = asyncHandler(async (req, res) => {
  const { jobstatus, editedBy } = req.body;
  const newJob = await Job.create({
    ...req.body,
    statusHistory: [
      {
        jobstatus,
        editedBy,
        updatedAt: new Date(),
      },
    ],
  });
  res.status(201).json(newJob);
});

const editJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { jobstatus, editedBy, ...updateData } = req.body;

  // Find the job by ID
  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  // Update the current job status and append to status history if status is provided
  if (jobstatus) {
    job.jobstatus = jobstatus;
    const statusIndex = job.statusHistory.findIndex(
      (status) => status.jobstatus === jobstatus
    );

    if (statusIndex !== -1) {
      job.statusHistory[statusIndex].editedBy = editedBy;
      job.statusHistory[statusIndex].updatedAt = new Date();
    } else {
      job.statusHistory.push({
        jobstatus,
        editedBy,
        updatedAt: new Date(),
      });
    }
  }

  // Update other job fields
  Object.assign(job, updateData);

  // Save the updated job
  const updatedJob = await job.save();

  // Emit an event if needed
  // req.io.emit("jobUpdated", updatedJob);

  res.json(updatedJob);
});

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Delete the specified job
  const deletedJob = await Job.findByIdAndDelete(id);
  if (!deletedJob) {
    return res.status(404).json({ error: "Job not found" });
  }

  // Retrieve all remaining jobs sorted by their current job card number
  const jobs = await Job.find().sort({ jobCardNumber: 1 });

  // Update the job card numbers to ensure they are sequential
  for (let i = 0; i < jobs.length; i++) {
    jobs[i].jobCardNumber = i + 1; // Setting job card numbers sequentially
    await jobs[i].save(); // Save the updated job
  }

  // Emit the jobDeleted event
  req.io.emit("jobDeleted", deletedJob);

  // Respond with a success message
  res.json({ message: "Job deleted successfully" });
});

module.exports = { listJobs, viewJob, addJob, editJob, deleteJob };
