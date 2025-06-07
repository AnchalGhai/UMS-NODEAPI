console.log("index.js started");
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
  console.log("Admin routes loaded");
} catch (error) {
  console.error("❌ Failed to load admin routes:", error.message);
  console.error(error.stack);
}

// Department routes
try {
  const departmentRoutes = require("./routes/department");
  app.use("/api/departments", departmentRoutes);
  console.log("Department routes loaded");
} catch (error) {
  console.error("❌ Failed to load department routes:", error.message);
  console.error(error.stack);
}

// Student routes
try {
  const studentRoutes = require('./routes/studentRoutes');
  app.use('/api/students', studentRoutes);
  console.log("Student routes loaded");
} catch (error) {
  console.error("❌ Failed to load student routes:", error.message);
  console.error(error.stack);
}

// Professor routes
try {
  const professorRoutes = require('./routes/professorRoutes');
  app.use('/api/professors', professorRoutes);
  console.log("Professor routes loaded");
} catch (error) {
  console.error('❌ Failed to load professor routes:', error.message);
  console.error(error.stack);
}

// Course Routes
try {
  const courseRoutes = require('./routes/courseRoutes');
 //console.log('✅ courseRoutes typeof:', typeof courseRoutes);
  app.use('/api/courses', courseRoutes);
  console.log("Course routes loaded");
} catch (error) {
  console.error('❌ Failed to load course routes:', error.message);
  console.error(error.stack);
}

// Semester routes
try {
  const semesterRoutes = require('./routes/semesterRoutes');
  app.use('/api/semesters', semesterRoutes);
  console.log("Semester routes loaded");
} catch (error) {
  console.error('❌ Failed to load semester routes:', error.message);
  console.error(error.stack);
}

// Classroom routes
try {
  const classroomRoutes = require('./routes/classroomRoutes');
  app.use('/api/classrooms', classroomRoutes);
  console.log("Classroom routes loaded");
} catch (error) {
  console.error('❌ Failed to load classroom routes:', error.message);
  console.error(error.stack);
}

//schedules routes
try {
  const scheduleRoutes = require('./routes/scheduleRoutes');
  app.use('/api/schedules', scheduleRoutes);
  console.log("Schedule routes loaded");
} catch (error) {
  console.error('❌ Failed to load schedule routes:', error.message);
  console.error(error.stack);
}



app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
