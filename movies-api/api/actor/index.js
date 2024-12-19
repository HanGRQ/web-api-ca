import express from 'express';
import asyncHandler from 'express-async-handler';
import { getActorDetails, getActorMovies } from '../tmdb-api.js';
import Actor from './actorModel.js';

const router = express.Router();

router.get('/actor/:id', asyncHandler(async (req, res) => {
    const { id } = req.params; // actorId
    try {
        const actorDetails = await getActorDetails(id); // 调用 TMDB 的 `/person/{actorId}`
        res.status(200).json(actorDetails);
    } catch (error) {
        console.error(`Error fetching details for actorId ${id}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch actor details' });
    }
}));

export default router;
