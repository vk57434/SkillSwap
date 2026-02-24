const router = require("express").Router();
const protect = require("../middleware/authMiddleware");

const {
	sendRequest,
	getRequests,
	updateRequest
} = require("../controllers/requestController");


// Send skill swap request
router.post("/", protect, sendRequest);

// Get my requests
router.get("/", protect, getRequests);

// Accept / Reject
router.put("/:id", protect, updateRequest);

module.exports = router;
