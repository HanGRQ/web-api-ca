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

const paginateResults = async (getMoviesFunction, req, res) => {
    let { page = 1, limit = 8 } = req.query;
    [page, limit] = [+page, +limit];

    const moviesResponse = await getMoviesFunction();

    if (!moviesResponse || !moviesResponse.results) {
        return res.status(400).json({ message: "Invalid response structure: Missing or invalid 'results'" });
    }

    const total_results = moviesResponse.results.length;
    const total_pages = Math.ceil(total_results / limit);

    const paginatedResults = moviesResponse.results.slice((page - 1) * limit, page * limit);

    const returnObject = {
        page,
        total_pages,
        total_results,
        results: paginatedResults,
    };

    res.status(200).json(returnObject);
};

/**
 * @swagger
 * /api/movies/tmdb/upcoming:
 *   get:
 *     summary: Get upcoming movies
 *     description: Retrieve a list of upcoming movies from the TMDB API with pagination.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of movies per page (default is 8).
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved upcoming movies.
 *       400:
 *         description: Invalid response structure.
 *       500:
 *         description: Internal server error.
 */

router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    await paginateResults(getUpcomingMovies, req, res);
}));

/**
 * @swagger
 * /api/movies/tmdb/now-playing:
 *   get:
 *     summary: Get now-playing movies
 *     description: Retrieve a list of movies currently playing in theaters, with pagination support.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of movies per page (default is 8).
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved now-playing movies.
 *       500:
 *         description: Internal server error.
 */
router.get('/tmdb/now-playing', asyncHandler(async (req, res) => {
    await paginateResults(getNowPlayingMovies, req, res);
}));

/**
 * @swagger
 * /api/movies/tmdb/trending:
 *   get:
 *     summary: Get trending movies
 *     description: Retrieve a list of trending movies, with pagination support.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of movies per page (default is 8).
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved trending movies.
 *       500:
 *         description: Internal server error.
 */
router.get('/tmdb/trending', asyncHandler(async (req, res) => {
    await paginateResults(getTrendingMovies, req, res);
}));


/**
 * @swagger
 * /api/movies/tmdb/genres:
 *   get:
 *     summary: Get movie genres
 *     description: Retrieve a list of available movie genres.
 *     responses:
 *       200:
 *         description: Successfully retrieved movie genres.
 *       500:
 *         description: Internal server error.
 */
router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const genres = await getMovieGenres();
    res.status(200).json(genres.genres);
}));

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

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     responses:
 *       200:
 *         description: Successfully retrieved movies.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie details
 *     description: Retrieve details for a specific movie by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved movie details.
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Internal server error.
 */

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


/**
 * @swagger
 * /api/movies/{id}/reviews:
 *   get:
 *     summary: Get movie reviews
 *     description: Retrieve reviews for a specific movie by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve reviews for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved movie reviews.
 *       400:
 *         description: Invalid movie ID.
 *       500:
 *         description: Failed to fetch reviews.
 */
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


/**
 * @swagger
 * /api/movies/{id}/recommendations:
 *   get:
 *     summary: Get movie recommendations
 *     description: Retrieve a list of recommended movies for the specified movie ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve recommendations for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved movie recommendations.
 *       500:
 *         description: Internal server error.
 */

router.get('/:id/recommendations', asyncHandler(async (req, res) => {
    const recommendations = await getMovieRecommendations(req.movieId);
    res.status(200).json(recommendations.results);
}));

/**
 * @swagger
 * /api/movies/{id}/similar:
 *   get:
 *     summary: Get similar movies
 *     description: Retrieve a list of movies similar to the specified movie by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve similar movies for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved similar movies.
 *       500:
 *         description: Internal server error.
 */

router.get('/:id/similar', asyncHandler(async (req, res) => {
    const similar = await getSimilarMovies(req.movieId);
    res.status(200).json(similar.results);
}));

/**
 * @swagger
 * /api/movies/{id}/credits:
 *   get:
 *     summary: Get movie credits
 *     description: Retrieve the cast and crew for a specific movie by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve credits for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved movie credits.
 *       500:
 *         description: Internal server error.
 */

router.get('/:id/credits', asyncHandler(async (req, res) => {
    const credits = await getMovieCredits(req.movieId);
    res.status(200).json(credits);
}));

/**
 * @swagger
 * /api/movies/{id}/images:
 *   get:
 *     summary: Get movie images
 *     description: Retrieve images for a specific movie by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve images for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved movie images.
 *       500:
 *         description: Failed to fetch images.
 */
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
