import express from "express";

const router = express.Router();
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ massage: "All fields are requried " });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ massage: "Passsword should be at least 6 characters" });
  }
  if (username.length < 3) {
    return res
      .status(400)
      .json({ massage: "Username should be at least 3 characters" });
  }

  const existindUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existindUser) {
    return res.status(400).json({ massage: "User already existed" });
  }
  const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  const user = new User({
    email,
    username,
    password,
    profileImage: profileImage,
  });

  await user.save();

  const token = generateToken(user._id);
  res.status(201).json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ massage: "All fields are requried " });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ massage: "User does not exist" });

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ massage: "Password is wrong" });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ massage: "Internal Error:" });
  }
});

export default router;
