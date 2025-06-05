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

try {
  const adminRoutes = require("./routes/admin");
  app.use("/api/admin", adminRoutes);
  console.log("✅ Admin routes loaded");

   const departmentRoutes = require("./routes/department");
  app.use("/api/departments", departmentRoutes);
  console.log("✅ Department routes loaded");
  
} catch (error) {
  console.error("❌ Failed to load admin routes:", error.message);
}

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
