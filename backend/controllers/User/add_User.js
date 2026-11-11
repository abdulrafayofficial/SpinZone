import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { sendError } from "../../utils/sendError.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone, playingLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const userExist = await User.findOne({ email: email.toLowerCase() });

    if (userExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      playingLevel,
    });

    return res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
        role: userCreated.role,
      },
    });
  } catch (error) {
    return sendError(res, error, "Signup error");
  }
};
