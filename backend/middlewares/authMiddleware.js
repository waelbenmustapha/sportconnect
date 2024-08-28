import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Missing authorization header" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Invalid authorization header format" });
    }

    const token = authHeader.substring(7); // Extract the token

    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token

    req.user = { userId: decoded.userId }; // Attach the userId to req.user

    next(); // Call the next middleware
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid authorization token" });
  }
};

export default authMiddleware;
