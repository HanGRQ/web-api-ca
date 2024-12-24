import jwt from 'jsonwebtoken';
import User from '../api/users/userModel';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization header is missing' });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Bearer token is missing' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await User.findByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(401).json({ success: false, message: `Authentication failed: ${err.message}` });
  }
};

export default authenticate;
