const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// SIGNUP
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // Password hash karo (plain nahi save karna)
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser(email, hashedPassword);

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    // Agar "user already exist" error aaya
    if (err.message === "user already exist!") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await userModel.findUser(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};