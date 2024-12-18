import express from 'express';
import asyncHandler from 'express-async-handler';
import Review from './reviewModel.js';
import { getMovieReviews } from '../tmdb-api.js';

const router = express.Router();

// 获取 TMDB 评论并存储到 MongoDB
router.post('/import/:movieId', asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const TMDB_API_URL = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${process.env.TMDB_KEY}`;

    // 调用 TMDB API 获取评论数据
    const response = await fetch(TMDB_API_URL);
    if (!response.ok) {
        res.status(500).json({ message: 'Failed to fetch reviews from TMDB.' });
        return;
    }

    const data = await response.json();

    // 如果没有评论，返回提示信息
    if (data.results.length === 0) {
        res.status(404).json({ message: 'No reviews found for the specified movie.' });
        return;
    }

    // 保存评论到 MongoDB
    const reviewsToSave = data.results.map((review) => ({
        movieId,
        reviewId: review.id,
        author: review.author,
        content: review.content,
        createdAt: review.created_at,
    }));

    await Review.insertMany(reviewsToSave);
    res.status(201).json({ message: 'Reviews imported successfully!', reviews: reviewsToSave });
}));

// 获取某个电影的所有评论（从 TMDB 获取）
router.get('/:movieId', asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    // 调用 TMDB API 获取评论
    const reviews = await getMovieReviews(movieId);

    if (!reviews || reviews.length === 0) {
        res.status(404).json({ message: 'No reviews found for the specified movie.' });
        return;
    }

    res.status(200).json(reviews);
}));

// 获取某条特定评论（从 TMDB 评论数据中查找）
router.get('/:movieId/:reviewId', asyncHandler(async (req, res) => {
    const { movieId, reviewId } = req.params;

    // 调用 TMDB API 获取电影评论
    const reviews = await getMovieReviews(movieId);

    // 查找指定的评论
    const review = reviews.results.find((r) => r.id === reviewId);

    if (!review) {
        res.status(404).json({ message: 'Review not found.' });
        return;
    }

    res.status(200).json(review);
}));

export default router;
