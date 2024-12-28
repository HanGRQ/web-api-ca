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

/**
 * @swagger
 * /api/users/check/{email}:
 *   get:
 *     summary: Check if a user exists
 *     description: Checks whether a user with the given email exists in the database.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email to check.
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Whether the user exists.
 *       400:
 *         description: Invalid email format.
 *       500:
 *         description: Server error.
 */

router.get('/check/:email', asyncHandler(async (req, res) => {
  const user = await User.findByEmail(req.params.email);
  res.json({ exists: !!user });
}));

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               photoURL:
 *                 type: string
 *                 example: http://example.com/photo.jpg
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Bad request (e.g., email already registered).
 *       500:
 *         description: Server error.
 */

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
      photoURL: photoURL || '', 
      favorites: [], 
      watchlist: []  
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


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User successfully authenticated.
 *       401:
 *         description: Authentication failed.
 *       500:
 *         description: Server error.
 */

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

/**
 * @swagger
 * /api/users/google-auth:
 *   post:
 *     summary: Google Authentication
 *     description: Authenticate a user using Google credentials. If the user exists, it updates the user's photo. Otherwise, it creates a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's Google email address.
 *                 example: user@example.com
 *               googleId:
 *                 type: string
 *                 description: The Google ID of the user.
 *                 example: abc123xyz
 *               photoURL:
 *                 type: string
 *                 format: uri
 *                 description: The user's profile photo URL from Google.
 *                 example: https://example.com/photo.jpg
 *     responses:
 *       200:
 *         description: Successfully authenticated the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token for the user.
 *                   example: Bearer abcdefghijklmnopqrstuvwxyz
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address.
 *                       example: user@example.com
 *                     photoURL:
 *                       type: string
 *                       format: uri
 *                       description: URL of the user's profile photo.
 *                       example: https://example.com/photo.jpg
 *                     favorites:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of favorite movie IDs.
 *                       example: ["123", "456"]
 *                     watchlist:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of movie IDs in the user's watchlist.
 *                       example: ["789", "101"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Account creation date and time.
 *                       example: 2024-12-28T12:34:56Z
 *       500:
 *         description: Server error or database failure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the operation failed.
 *                   example: false
 *                 msg:
 *                   type: string
 *                   description: Error message detailing the failure.
 *                   example: Internal server error.
 */
router.post('/google-auth', asyncHandler(async (req, res) => {
  const { email, googleId, photoURL } = req.body;

  try {
    let user = await User.findByEmail(email);

    if (user) {
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    } else {
      user = new User({
        email,
        password: googleId,
        photoURL,
        favorites: [], 
        watchlist: [] 
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

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Retrieve user details
 *     description: Fetches details of the currently logged-in user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details successfully retrieved.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error.
 */

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

/**
 * @swagger
 * /api/users/favorites/{movieId}:
 *   post:
 *     summary: Add a movie to the user's favorites
 *     description: Adds a movie to the authenticated user's favorites list.
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to add to favorites.
 *     responses:
 *       200:
 *         description: Movie successfully added to favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["123", "456"]
 *       400:
 *         description: Movie is already in the user's favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Movie already in favorites.
 *       401:
 *         description: Unauthorized access.
 */
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

/**
 * @swagger
 * /api/users/favorites/{movieId}:
 *   delete:
 *     summary: Remove a movie from the user's favorites
 *     description: Removes a movie from the authenticated user's favorites list.
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to remove from favorites.
 *     responses:
 *       200:
 *         description: Movie successfully removed from favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["123"]
 *       401:
 *         description: Unauthorized access.
 */
router.delete('/favorites/:movieId', authenticate, asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId); 
  const user = req.user;

  user.favorites = user.favorites.filter((id) => id !== movieId);
  await user.save();
  res.status(200).json({ success: true, favorites: user.favorites });
}));

/**
 * @swagger
 * /api/users/watchlist/{movieId}:
 *   post:
 *     summary: Add a movie to the user's watchlist
 *     description: Adds a movie to the authenticated user's watchlist.
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to add to the watchlist.
 *     responses:
 *       200:
 *         description: Movie successfully added to the watchlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 watchlist:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["123", "789"]
 *       401:
 *         description: Unauthorized access.
 */
router.post('/watchlist/:movieId', authenticate, asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const updatedWatchlist = await req.user.addToWatchlist(movieId);
  res.status(200).json({
    success: true,
    watchlist: req.user.watchlist
  });
}));

/**
 * @swagger
 * /api/users/watchlist/{movieId}:
 *   delete:
 *     summary: Remove a movie from the user's watchlist
 *     description: Removes a movie from the authenticated user's watchlist.
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to remove from the watchlist.
 *     responses:
 *       200:
 *         description: Movie successfully removed from the watchlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 watchlist:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["789"]
 *       401:
 *         description: Unauthorized access.
 */
router.delete('/watchlist/:movieId', authenticate, asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const updatedWatchlist = await req.user.removeFromWatchlist(movieId);
  res.status(200).json({
    success: true,
    watchlist: req.user.watchlist
  });
}));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Fetches all users from the database.
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   photoURL:
 *                     type: string
 *                     format: uri
 *                     example: https://example.com/photo.jpg
 *                   favorites:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["123", "456"]
 *                   watchlist:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["789"]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-12-28T12:34:56Z
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch users.
 */
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