// routes/jobStatusRoutes.js

const express = require("express");
const router = express.Router();
const {
  listJobStatuses,
  addJobStatus,
} = require("../controllers/jobStatusController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, listJobStatuses); // Route for fetching job statuses
router.post("/", protect, addJobStatus); // Route for adding a new job status

module.exports = router;
