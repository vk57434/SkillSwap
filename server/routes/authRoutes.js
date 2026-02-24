const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {registerUser,loginUser,getProfile,getAllUsers} = require("../controllers/authController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",protect,getProfile);
router.get("/all",getAllUsers);

module.exports = router;
