const router = require("express").Router();
const protect = require("../middleware/authMiddleware");

const {
  leaveFeedback,
  getUserFeedback
} = require("../controllers/feedbackController");


// Leave feedback
router.post("/", protect, leaveFeedback);

// Get feedback for a user
router.get("/:userId", protect, getUserFeedback);

module.exports = router; 
