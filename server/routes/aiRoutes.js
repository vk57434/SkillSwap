const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const { generateLesson } = require("../controllers/aiController");

router.post("/lesson", protect, generateLesson);

module.exports = router;
