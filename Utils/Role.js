const user = require("../Models/User");

const rolecheck = (role) => {
  return async (req, res, next) => { 
    try {
      const userData = await user.findById(req.user.userId);
      if (userData) {
        if (role === userData.role) { 
          next(); 
        } else {
          return res.status(403).json({ message: "Unauthorized access" });
        }
      } else {
        return res.status(400).json({ message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { rolecheck };
