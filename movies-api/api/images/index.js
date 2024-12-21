import express from 'express';
import Images from './imageModel';
import { getMovieImages } from '../tmdb-api.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get('/movie/:id', asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id);
    let images = await Images.findByMovieId(movieId);
    
    if (!images) {
        const tmdbImages = await getMovieImages(movieId);
        images = new Images({
            movieId: movieId,
            backdrops: tmdbImages.backdrops,
            posters: tmdbImages.posters
        });
        await images.save();
    }
    res.status(200).json(images);
}));

export default router;