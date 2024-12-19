import express from 'express';
import asyncHandler from 'express-async-handler';
import Review from './reviewModel.js';
import { getMovieReviews } from '../tmdb-api.js';

const router = express.Router();

router.get('/movie/:id', asyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const reviewsInDB = await Review.find({ movieId });

    if (reviewsInDB.length === 0) {
        const data = await getMovieReviews(movieId);
        const newReviews = await Promise.all(
            data.results.map((review) => {
                return Review.create({
                    movieId,
                    author: review.author,
                    content: review.content,
                    createdAt: review.created_at,
                });
            })
        );
        res.status(200).json(newReviews);
    } else {
        res.status(200).json(reviewsInDB);
    }
}));

export default router;
