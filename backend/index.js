console.log("✅ index.js started");
require('dotenv').config();
const express = require("express");
const cors = require("cors");


const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🎓 University Management Backend is running!");
});

// Admin routes
try {
  const adminRoutes = require("./routes/admin");
  app.use("/api/admin", adminRoutes);
  console.log("✅ Admin routes loaded");
} catch (error) {
  console.error("❌ Failed to load admin routes:", error.message);
  console.error(error.stack);
}

// Department routes
try {
  const departmentRoutes = require("./routes/department");
  app.use("/api/departments", departmentRoutes);
  console.log("✅ Department routes loaded");
} catch (error) {
  console.error("❌ Failed to load department routes:", error.message);
  console.error(error.stack);
}

// Student routes
try {
  const studentRoutes = require('./routes/studentRoutes');
  //console.log("studentRoutes:", studentRoutes);
  app.use('/api/students', studentRoutes);
  console.log("✅ Student routes loaded");
} catch (error) {
  console.error("❌ Failed to load student routes:", error.message);
  console.error(error.stack);
}

// Professor routes
try {
  const professorRoutes = require('./routes/professorRoutes');
  app.use('/api/professors', professorRoutes);
  console.log('✅ Professor routes loaded');
} catch (error) {
  console.error('❌ Failed to load professor routes:', error.message);
  console.error(error.stack);
}


app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
