const router = require("express").Router();
const protect = require("../middleware/authMiddleware");

const {
  addSkill,
  getMySkills,
  deleteSkill
} = require("../controllers/skillController");


// Add skill
router.post("/", protect, addSkill);

// Get my skills
router.get("/", protect, getMySkills);

// Get all skills
router.get("/all/users", require("../controllers/skillController").getAllSkills);

// Delete skill
router.delete("/:id", protect, deleteSkill);

module.exports = router;
