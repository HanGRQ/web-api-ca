import express from 'express';
import asyncHandler from 'express-async-handler';
import { getActorDetails, getActorMovies } from '../tmdb-api.js';
import Actor from './actorModel.js';

const router = express.Router();

// 获取演员详情并存储到 MongoDB
router.get('/:id', asyncHandler(async (req, res) => {
    const actorId = req.params.id;

    // 调用 TMDB API 获取数据
    const actorDetails = await getActorDetails(actorId);
    const actorMovies = await getActorMovies(actorId);

    // 保存或更新数据到 MongoDB
    const actor = await Actor.findOneAndUpdate(
        { id: actorId },
        { ...actorDetails, movie_credits: actorMovies.cast },
        { upsert: true, new: true }
    );

    res.status(200).json(actor);
}));

export default router;
