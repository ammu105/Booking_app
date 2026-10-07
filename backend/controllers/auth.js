import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError} from "../utils/error.js";

// register controller

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    const user = new User({
      ...req.body,
      password: hash,
    });

    const savedUser = await user.save();

    console.log("USER SAVED:");
    console.log(savedUser);

    res.status(201).json({
      message: "User created",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    next(err);
  }
};

//login controller

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const valid = await bcrypt.compare(
    
      req.body.password,
      user.password
    );

    if (!valid) {
      return next(
        createError(400, "Wrong username or password")
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT,
      {
        expiresIn: "1d",
      }
    );

    const { password, ...details } = user._doc;
    

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
    message: "Login successful"},
    details);
  } catch (err) {
    next(err);
  }
};