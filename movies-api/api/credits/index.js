import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMovieCredits } from '../tmdb-api.js';

const router = express.Router();

router.get('/movie/:id/credits', asyncHandler(async (req, res) => {
    const { id } = req.params; // movieId
    try {
        const credits = await getMovieCredits(id); // 调用 TMDB 的 `/movie/{movieId}/credits`
        res.status(200).json(credits);
    } catch (error) {
        console.error(`Error fetching credits for movieId ${id}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch movie credits' });
    }
}));

export default router;
