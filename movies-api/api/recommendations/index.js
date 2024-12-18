import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMovieRecommendations } from '../tmdb-api.js';
import Recommendation from './recommendationModel.js';

const router = express.Router();

// 获取电影推荐列表并存储到 MongoDB
router.get('/:movieId', asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;

    // 调用 TMDB API 获取推荐电影数据
    const recommendationsData = await getMovieRecommendations({ queryKey: [null, { id: movieId }] });

    // 保存或更新数据到 MongoDB
    const recommendations = await Recommendation.findOneAndUpdate(
        { movieId },
        { movieId, recommendations: recommendationsData.results },
        { upsert: true, new: true }
    );

    res.status(200).json(recommendations);
}));

export default router;
