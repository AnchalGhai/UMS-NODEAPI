const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


// POST /api/admin/signup
router.post("/signup", adminController.signup);

// POST /api/admin/login
router.post("/login", adminController.loginAdmin);


// ✅ Properly export the router
module.exports = router;
