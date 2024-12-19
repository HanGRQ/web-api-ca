import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import express from 'express';
import { 
    getMovie,
    getUpcomingMovies, 
    getTrendingMovies, 
    getNowPlayingMovies, 
    getMovieGenres, 
    getMovieReviews ,
    getMovieRecommendations,
    getMovieCredits,
    getSimilarMovies,
} from '../tmdb-api';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

    // Parallel execution of counting movies and getting movies using movieModel
    const [total_results, results] = await Promise.all([
        movieModel.estimatedDocumentCount(),
        movieModel.find().limit(limit).skip((page - 1) * limit)
    ]);
    const total_pages = Math.ceil(total_results / limit); //Calculate total number of pages (= total No Docs/Number of docs per page) 

    //construct return Object and insert into response object
    const returnObject = {
        page,
        total_pages,
        total_results,
        results
    };
    res.status(200).json(returnObject);
}));

// Get movie details
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id,10);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({message: 'The movie you requested could not be found.', status_code: 404});
    }
}));

router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    res.status(200).json(upcomingMovies);
}));

router.get('/tmdb/now-playing', asyncHandler(async (req, res) => {
    const nowPlayingMovies = await getNowPlayingMovies();
    res.status(200).json(nowPlayingMovies);
}));

router.get('/tmdb/trending', asyncHandler(async (req, res) => {
    const trendingMovies = await getTrendingMovies();
    res.status(200).json(trendingMovies);
}));

router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const genres = await getMovieGenres();
    res.status(200).json(genres);
}));

router.get('/:id/reviews', asyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const reviewsData = await getMovieReviews(movieId);
    res.status(200).json(reviewsData.results);
}));

router.get('/:id/recommendations', asyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const recommendations = await getMovieRecommendations(movieId);
    res.status(200).json(recommendations.results);
}));

router.get('/:id/similar', asyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const similar = await getSimilarMovies(movieId);
    res.status(200).json(similar.results);
}));

router.get('/:id/credits', asyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const credits = await getMovieCredits(movieId);
    res.status(200).json(credits.results);
}));

export default router;