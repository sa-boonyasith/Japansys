const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET, // JWT secret from .env file
      { expiresIn: "1h" }
    );

    // Respond with token and user details
    res.json({
      message: "Login successful",
      token,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        username: user.username,  // Include username if necessary
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};
