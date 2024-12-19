import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMovieRecommendations } from '../tmdb-api.js';
import Recommendation from './recommendationModel.js';

const router = express.Router();

router.get('/movie/:id', asyncHandler(async (req, res) => {
    const movieId = req.params.id;

    if (!movieId) {
        return res.status(400).json({ message: 'Invalid movie ID' });
    }

    try {
        const recommendationsInDB = await Recommendation.findOne({ movieId });

        if (!recommendationsInDB) {
            const data = await getMovieRecommendations(movieId);
            if (!data || !data.results || data.results.length === 0) {
                return res.status(404).json({ message: 'No recommendations found' });
            }

            const newRecommendations = await Recommendation.create({
                movieId,
                recommendations: data.results.map((rec) => ({
                    movieId: rec.id,
                    title: rec.title || 'No title available',
                    overview: rec.overview || 'No overview available',
                    poster_path: rec.poster_path || null,
                    release_date: rec.release_date || 'Unknown',
                })),
            });

            return res.status(201).json(newRecommendations.recommendations);
        }

        res.status(200).json(recommendationsInDB.recommendations);
    } catch (error) {
        console.error(`Error fetching recommendations for movie ${movieId}:`, error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}));



export default router;
