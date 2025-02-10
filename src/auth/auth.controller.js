import { hash, compare } from "bcrypt";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

export const register = async (req, res) => {
  try {
    const data = req.body;
    let profilePicture = req.file ? req.file.filename : null;
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        error: "Email or username already in use",
      });
    }

    const encryptedPassword = await hash(data.password, 10);
    data.password = encryptedPassword;
    data.profilePicture = profilePicture;

    if (data.role === "STUDENT_ROLE") {
      if (data.assignedCourses && data.assignedCourses.length > 3) {
        return res.status(400).json({
          message: "Student cannot be assigned more than 3 courses",
        });
      }

      const uniqueCourses = new Set(data.assignedCourses);
      if (uniqueCourses.size !== data.assignedCourses.length) {
        return res.status(400).json({
          message: "Duplicate courses are not allowed",
        });
      }
      data.assignedCourses = [...uniqueCourses];
    }

    const user = await User.create(data);

    return res.status(201).json({
      message: "User has been created successfully",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    return res.status(500).json({
      message: "User registration failed",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        error: "No such user or email found",
      });
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
        error: "Incorrect password",
      });
    }

    const token = await generateJWT(user.id);

    return res.status(200).json({
      message: "Login successful",
      userDetails: {
        token: token,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed, server error",
      error: err.message,
    });
  }
};
