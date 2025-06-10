const bcrypt = require("bcrypt");
const pool = require("../db");

const signup = async (req, res) => {
  const { name, email, admin_id, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admins (admin_id, name, email, password) VALUES ($1, $2, $3, $4)",
      [admin_id, name, email, hashedPassword]
    );
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginAdmin = async (req, res) => {
  const { admin_id, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE admin_id = $1", [admin_id]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Admin not found" });
    }

    const admin = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
    }
     return res.json({
    message: "Login successful",
    name: admin.name,    // Add this line
    admin_id: admin.admin_id
  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, loginAdmin };
