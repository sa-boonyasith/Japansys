const prisma = require("../config/prisma");
const bcrypt = require('bcryptjs');

exports.create = async(req,res)=>{
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};

exports.update = async (req, res) => {
  try {
    const { username, role } = req.body;

    // Validate input
    if (!username || !role) {
      return res.status(400).json({ error: "Username and role are required" });
    }

    // Log input data
    console.log("Input:", { username, role });

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { role },
    });

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error during role update:", error);
    res.status(500).json({ error: "An error occurred while updating the role" });
  }
};
  