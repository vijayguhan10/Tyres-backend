const User = require("../Models/User");
const {
  generateToken,
  hashPassword,
  comparePassword,
  verifyToken,
} = require("../Auth/auth");
const createUser = async (req, res) => {
  const { name, email, password, role, levellogin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate levellogin if role is client
    if (role === "client") {
      if (!levellogin) {
        return res.status(400).json({
          message: "Level login is required for client role",
        });
      }
      if (!["enterprice", "individual"].includes(levellogin)) {
        return res.status(400).json({
          message: "Level login must be either 'enterprice' or 'individual'",
        });
      }
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "client" && { levellogin }),
    });

    await newUser.save();
    const token = generateToken(newUser._id, newUser.role, newUser.levellogin);
    res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  console.log("req.body : ", req.body);
  console.log("role : ", role);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Check if the roles match
    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role access" });
    }
    const token = generateToken(user._id, user.role, user.levellogin);
    console.log("token : ", token);
    res.status(200).json({
      message: "Login successful",
      token,
      levellogin: user.levellogin,
      userName: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const authenticateJWT = async (req, res, next) => {
  // const token = req.cookies.token;
  const token = req.headers.authorization?.split(" ")[1];

  // console.log("token : ", token);
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(error.status || 403).json({ message: error.message });
  }
};
module.exports = {
  createUser,
  loginUser,
  authenticateJWT,
};
