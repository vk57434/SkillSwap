const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

// Connect DB
connectDB();

const app = express();


// 🔥 Security Middleware
app.use(helmet());

// Logger (dev only)
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// CORS
app.use(cors());

// Body Parser
app.use(express.json());


// ✅ ROUTES
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/skills",require("./routes/skillRoutes"));
app.use("/api/requests",require("./routes/requestRoutes"));
app.use("/api/feedback",require("./routes/feedbackRoutes"));
app.use("/api/ai",require("./routes/aiRoutes"));





// Test route
app.get("/",(req,res)=>{
  res.send("🚀 SkillSwap API Running...");
});


// ✅ ERROR MIDDLEWARE (Always last)
app.use(errorHandler);


// ✅ PORT from ENV
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`🔥 Server running on port ${PORT}`);
});
