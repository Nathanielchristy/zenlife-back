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
  const newJob = await Job.create(req.body);
  // req.io.emit("jobAdded", newJob);
  res.status(201).json(newJob);
});

const editJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedJob) {
    return res.status(404).json({ error: "Job not found" });
  }
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
