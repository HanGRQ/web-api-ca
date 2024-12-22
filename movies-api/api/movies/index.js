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
    getMovieImages
} from '../tmdb-api';

const router = express.Router();

router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    console.log("Upcoming Movies Response:", upcomingMovies); // Debug log
    if (!upcomingMovies || !upcomingMovies.results) {
        return res.status(400).json({ message: "Invalid response structure: Missing or invalid 'results'" });
    }
    res.status(200).json(upcomingMovies); // Ensure the entire response is returned
}));

router.get('/tmdb/now-playing', asyncHandler(async (req, res) => {
    const nowPlayingMovies = await getNowPlayingMovies();
    console.log("Now Playing Movies Response:", nowPlayingMovies); // Debug log
    if (!nowPlayingMovies || !nowPlayingMovies.results) {
        return res.status(400).json({ message: "Invalid response structure: Missing or invalid 'results'" });
    }
    res.status(200).json(nowPlayingMovies); // Ensure the entire response is returned
}));

router.get('/tmdb/trending', asyncHandler(async (req, res) => {
    const trendingMovies = await getTrendingMovies();
    console.log("Trending Movies Response:", trendingMovies); // Debug log
    if (!trendingMovies || !trendingMovies.results) {
        return res.status(400).json({ message: "Invalid response structure: Missing or invalid 'results'" });
    }
    res.status(200).json(trendingMovies); // Ensure the entire response is returned
}));


// Route: Movie genres
router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const genres = await getMovieGenres();
    res.status(200).json(genres.genres);
}));

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
    let { page = 1, limit = 8 } = req.query;
    [page, limit] = [+page, +limit];

    const [total_results, results] = await Promise.all([
        movieModel.estimatedDocumentCount(), 
        movieModel.find().limit(limit).skip((page - 1) * limit) 
    ]);

    const total_pages = Math.ceil(total_results / limit);

    const returnObject = {
        page,
        total_pages,
        total_results,
        results
    };

    res.status(200).json(returnObject);
}));

// Route: Movie details
router.get('/:id', asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    if (isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie ID." });
    }

    const movie = await movieModel.findOne({ id: movieId });
    if (!movie) {
        return res.status(404).json({ message: "Movie not found." });
    }

    res.status(200).json(movie);
}));


// Route: Movie reviews
router.get('/:id/reviews', asyncHandler(async (req, res) => {
    const movieId = req.params.id;

    if (!movieId || isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie ID." });
    }

    const reviewsData = await getMovieReviews(movieId);

    if (!reviewsData || !Array.isArray(reviewsData.results)) {
        return res.status(500).json({ message: "Failed to fetch reviews." });
    }

    res.status(200).json({ results: reviewsData.results });
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

// Route: Movie Images
router.get('/:id/images', asyncHandler(async (req, res) => {
    const images = await getMovieImages(req.movieId);
    res.status(200).json(images);
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
