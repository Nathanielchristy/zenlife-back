const express = require("express");
const router = express.Router();
const {
  listJobs,
  viewJob,
  addJob,
  editJob,
  deleteJob,
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, listJobs); // Route for fetching jobs with pagination
router.get("/:id", protect, viewJob); // Route for viewing a single job
router.post("/", protect, addJob); // Route for adding a new job
router.patch("/:id", protect, editJob); // Route for editing an existing job
router.delete("/:id", protect, deleteJob); // Route for deleting a job

module.exports = router;
