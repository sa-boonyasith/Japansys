const prisma = require("../config/prisma");
const bcrypt = require('bcryptjs');

exports.create = async(req,res)=>{
  try {
    const { username,firstname,lastname, email, password } = req.body;

    // Validate input fields
    if (!username ||!firstname || !lastname|| !email || !password) {
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
      data: { username,firstname,lastname, email, password: hashedPassword },
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

exports.changepass = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // ตรวจสอบว่าข้อมูลถูกต้อง
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Email, old password, and new password are required' });
    }

    // ค้นหาผู้ใช้จาก email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ตรวจสอบรหัสผ่านเก่า
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // ป้องกันการใช้รหัสผ่านเดิม
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    // แฮชรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตรหัสผ่าน
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing the password' });
  }
};
  