// routes/index.js
import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, msg: 'No valid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findByEmail(decoded.email);
    
    if (!user) {
      return res.status(401).json({ success: false, msg: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

// Check if user exists by email
router.get('/check/:email', asyncHandler(async (req, res) => {
  const user = await User.findByEmail(req.params.email);
  res.json({ exists: !!user });
}));

// User registration
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, photoURL } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Email and password are required.'
    });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: 'Email already registered.'
      });
    }

    const user = new User({
      email,
      password,
      photoURL: photoURL || '', // 确保 photoURL 有默认值
      favorites: [], // 初始化 favorites
      watchlist: []  // 初始化 watchlist
    });

    await user.save();

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      msg: 'User successfully created.',
      token: 'Bearer ' + token,
      user: {
        email: user.email,
        photoURL: user.photoURL,
        favorites: user.favorites,
        watchlist: user.watchlist,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
}));


// User login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Email and password are required.'
    });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      msg: 'Authentication failed.'
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      msg: 'Authentication failed.'
    });
  }

  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    success: true,
    token: 'Bearer ' + token,
    user: {
      email: user.email,
      photoURL: user.photoURL,
      favorites: user.favorites,
      watchlist: user.watchlist,
      createdAt: user.createdAt
    }
  });
}));

// Google auth
router.post('/google-auth', asyncHandler(async (req, res) => {
  const { email, googleId, photoURL } = req.body;

  try {
    let user = await User.findByEmail(email);

    if (user) {
      // 更新现有用户
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    } else {
      // 创建新用户
      user = new User({
        email,
        password: googleId, // 使用 googleId 作为密码
        photoURL,
        favorites: [], // 初始化 favorites
        watchlist: []  // 初始化 watchlist
      });
      await user.save();
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: 'Bearer ' + token,
      user: {
        email: user.email,
        photoURL: user.photoURL,
        favorites: user.favorites,
        watchlist: user.watchlist,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
}));

// User data
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      email: req.user.email,
      photoURL: req.user.photoURL,
      favorites: req.user.favorites,
      watchlist: req.user.watchlist,
      createdAt: req.user.createdAt
    }
  });
}));


// 收藏和观看列表路由
router.post('/favorites/:movieId', authenticate, asyncHandler(async (req, res) => {
  const movieId = req.params.movieId;
  const user = req.user;

  if (!user.favorites.includes(movieId)) {
    user.favorites.push(movieId);
    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } else {
    res.status(400).json({ success: false, message: "Movie already in favorites." });
  }
}));

router.delete('/favorites/:movieId', authenticate, asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId); 
  const user = req.user;

  user.favorites = user.favorites.filter((id) => id !== movieId);
  await user.save();
  res.status(200).json({ success: true, favorites: user.favorites });
}));


router.post('/watchlist/:movieId', authenticate, asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const updatedWatchlist = await req.user.addToWatchlist(movieId);
  res.status(200).json({
    success: true,
    watchlist: req.user.watchlist
  });
}));

router.delete('/watchlist/:movieId', authenticate, asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const updatedWatchlist = await req.user.removeFromWatchlist(movieId);
  res.status(200).json({
    success: true,
    watchlist: req.user.watchlist
  });
}));

router.get("/", async (req, res) => {
  try {
    const users = await User.find(); 
    console.log("Fetched users:", users);
    res.status(200).json(users); 
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
});



export default router;