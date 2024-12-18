import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMovieCredits } from '../tmdb-api.js';
import Credit from './creditModel.js';

const router = express.Router();

// 获取电影演员/剧组信息并存储到 MongoDB
router.get('/:movieId', asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;

    // 调用 TMDB API 获取电影 credits 数据
    const creditsData = await getMovieCredits(movieId);

    // 保存或更新数据到 MongoDB
    const credits = await Credit.findOneAndUpdate(
        { movieId },
        { movieId, ...creditsData },
        { upsert: true, new: true }
    );

    res.status(200).json(credits);
}));

export default router;
