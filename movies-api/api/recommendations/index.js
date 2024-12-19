import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMovieRecommendations } from '../tmdb-api.js';
import Recommendation from './recommendationModel.js';

const router = express.Router();

router.get('/movie/:id', asyncHandler(async (req, res) => {
    const movieId = req.params.id;
    let recommendations = await Recommendation.findOne({ movieId });

    if (!recommendations) {
        const data = await getMovieRecommendations({ queryKey: [null, { id: movieId }] });
        recommendations = await Recommendation.create({
            movieId,
            recommendations: data.results.map((rec) => ({
                id: rec.id,
                title: rec.title,
                overview: rec.overview,
            })),
        });
    }

    res.status(200).json(recommendations.recommendations);
}));

export default router;
