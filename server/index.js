const express = require("express");
const cors = require("cors");
// Force restart
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

// Scheduler
const initScheduler = require("./services/scheduler");
initScheduler();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
