import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import express from 'express';
import {
    getUpcomingMovies,
    getTrendingMovies,
    getNowPlayingMovies,
    getMovieGenres,
    getMovieReviews,
    getMovieRecommendations,
    getMovieCredits,
    getSimilarMovies,
} from '../tmdb-api';

const router = express.Router();

// Middleware: Validate and parse movie ID
router.param('id', (req, res, next, id) => {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: "Invalid movie ID. ID must be a number.",
        });
    }
    req.movieId = parsedId; // Attach validated ID to request object
    next();
});

// Route: Paginated movies
router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    [page, limit] = [+page, +limit];

    const [total_results, results] = await Promise.all([
        movieModel.estimatedDocumentCount(),
        movieModel.find().limit(limit).skip((page - 1) * limit),
    ]);

    const total_pages = Math.ceil(total_results / limit);

    res.status(200).json({
        page,
        total_pages,
        total_results,
        results,
    });
}));

// Route: Movie details
router.get('/:id', asyncHandler(async (req, res) => {
    const movie = await movieModel.findOne({ id: req.movieId });
    if (!movie) {
        return res.status(404).json({
            message: "Movie not found.",
            status_code: 404,
        });
    }
    res.status(200).json(movie);
}));

// Route: Movie reviews
router.get('/:id/reviews', asyncHandler(async (req, res) => {
    const reviewsData = await getMovieReviews(req.movieId);
    res.status(200).json(reviewsData.results);
}));

// Route: Movie recommendations
router.get('/:id/recommendations', asyncHandler(async (req, res) => {
    const recommendations = await getMovieRecommendations(req.movieId);
    res.status(200).json(recommendations.results);
}));

// Route: Similar movies
router.get('/:id/similar', asyncHandler(async (req, res) => {
    const similar = await getSimilarMovies(req.movieId);
    res.status(200).json(similar.results);
}));

// Route: Movie credits
router.get('/:id/credits', asyncHandler(async (req, res) => {
    const credits = await getMovieCredits(req.movieId);
    res.status(200).json(credits);
}));

// Route: Upcoming movies
router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    res.status(200).json(upcomingMovies.results);
}));

// Route: Now-playing movies
router.get('/tmdb/now-playing', asyncHandler(async (req, res) => {
    const nowPlayingMovies = await getNowPlayingMovies();
    res.status(200).json(nowPlayingMovies.results);
}));

// Route: Trending movies
router.get('/tmdb/trending', asyncHandler(async (req, res) => {
    const trendingMovies = await getTrendingMovies();
    res.status(200).json(trendingMovies.results);
}));

// Route: Movie genres
router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const genres = await getMovieGenres();
    res.status(200).json(genres.genres);
}));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal server error. Please try again later.",
        error: err.message,
    });
});

export default router;
