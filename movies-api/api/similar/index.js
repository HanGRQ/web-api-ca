import express from 'express';
import asyncHandler from 'express-async-handler';
import SimilarMovie from './similarMovieModel.js'; 
import { getSimilarMovies } from '../tmdb-api.js'; 

const router = express.Router();

router.get('/movie/:id', asyncHandler(async (req, res) => {
    const movieId = req.params.id;

    let similarMoviesInDB = await SimilarMovie.findOne({ movieId });
    if (!similarMoviesInDB) {
        try {
            const data = await getSimilarMovies(movieId);

            similarMoviesInDB = await SimilarMovie.create({
                movieId,
                similarMovies: data.results.map((similar) => ({
                    movieId: similar.id,
                    title: similar.title || 'No title available',
                    overview: similar.overview || 'No overview available',
                    poster_path: similar.poster_path || null,
                    release_date: similar.release_date || 'Unknown',
                })),
            });
        } catch (error) {
            console.error(`Error fetching similar movies for movie ${movieId}:`, error.message);
            return res.status(500).json({ message: 'Failed to fetch similar movies' });
        }
    }

    res.status(200).json(similarMoviesInDB.similarMovies);
}));

export default router;
