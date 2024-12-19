import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../api/users/userModel';
import Movie from '../api/movies/movieModel';
import Review from '../api/reviews/reviewModel';
import Actor from '../api/actor/actorModel';
import Recommendation from '../api/recommendations/recommendationModel';
import { getMovies, getMovieReviews, getActorDetails, getActorMovies, getMovieRecommendations } from '../api/tmdb-api.js';

async function loadMovies() {
    try {
        const moviesData = await getMovies(); // 从 TMDB 获取电影数据
        for (const movie of moviesData.results) {
            if (!movie.id) {
                console.error(`Movie missing id: ${JSON.stringify(movie)}`);
                continue; // 跳过没有 id 的电影
            }

            await Movie.create({
                id: movie.id, // 必填字段
                title: movie.title || 'No title available',
                overview: movie.overview || 'No overview available',
                release_date: movie.release_date || 'Unknown',
                poster_path: movie.poster_path || null,
                original_title: movie.original_title || movie.title,
                genre_ids: movie.genre_ids || [],
                original_language: movie.original_language || 'Unknown',
                backdrop_path: movie.backdrop_path || null,
                popularity: movie.popularity || 0,
                vote_count: movie.vote_count || 0,
                video: movie.video || false,
                vote_average: movie.vote_average || 0,
                production_countries: movie.production_countries || [],
                runtime: movie.runtime || 0,
                spoken_languages: movie.spoken_languages || [],
                status: movie.status || 'Unknown',
                tagline: movie.tagline || '',
            });
            console.log(`Movie loaded: ${movie.title}`);
        }
    } catch (err) {
        console.error('Error loading movies:', err.message);
    }
}

async function loadReviews() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        try {
            if (!movie.id) {
                console.error(`Movie in DB missing id: ${movie.title}`);
                continue; // 跳过没有 id 的电影
            }

            const reviewsData = await getMovieReviews(movie.id);
            for (const review of reviewsData.results) {
                await Review.create({
                    movieId: movie.id,
                    reviewId: review.id || `review-${Date.now()}`,
                    content: review.content || 'No content available.',
                    author: review.author || 'Anonymous',
                    createdAt: review.created_at || new Date(),
                });
            }
            console.log(`Reviews loaded for movie: ${movie.title}`);
        } catch (err) {
            console.error(`Error fetching reviews for movie ${movie.title}:`, err.message);
        }
    }
}


async function loadActors() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        try {
            if (!movie.id) {
                console.error(`Movie in DB missing id: ${movie.title}`);
                continue;
            }

            const actorData = await getActorMovies(movie.id);
            if (!actorData || !actorData.cast || actorData.cast.length === 0) {
                console.error(`No actor data found for movie: ${movie.title}`);
                continue;
            }

            for (const actor of actorData.cast) {
                if (!actor.id || !actor.name) {
                    console.error(`Invalid actor data: ${JSON.stringify(actor)}`);
                    continue; // 跳过无效演员
                }

                await Actor.create({
                    movieId: movie.id,
                    actorId: actor.id,
                    name: actor.name,
                    character: actor.character || 'Unknown',
                    profile_path: actor.profile_path || null,
                });
            }
            console.log(`Actors loaded for movie: ${movie.title}`);
        } catch (err) {
            console.error(`Error fetching actors for movie ${movie.title}:`, err.message);
        }
    }
}


async function loadActorDetails() {
    const actorsInDB = await Actor.find();
    for (const actor of actorsInDB) {
        const actorDetails = await getActorDetails(actor.actorId);
        await Actor.updateOne(
            { actorId: actor.actorId },
            {
                biography: actorDetails.biography,
                birthday: actorDetails.birthday,
                profile_path: actorDetails.profile_path,
            }
        );
        console.log(`Actor details updated: ${actor.name}`);
    }
}

async function loadRecommendations() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        try {
            if (!movie.id) {
                console.error(`Movie in DB missing id: ${movie.title}`);
                continue;
            }

            const recommendationsData = await getMovieRecommendations(movie.id);
            if (!recommendationsData || !recommendationsData.results || recommendationsData.results.length === 0) {
                console.error(`No recommendations found for movie: ${movie.title}`);
                continue;
            }

            await Recommendation.create({
                movieId: movie.id,
                recommendations: recommendationsData.results.map((rec) => ({
                    id: rec.id,
                    title: rec.title || 'No title available',
                    overview: rec.overview || 'No overview available',
                })),
            });
            console.log(`Recommendations loaded for movie: ${movie.title}`);
        } catch (err) {
            console.error(`Error fetching recommendations for movie ${movie.title}:`, err.message);
        }
    }
}


async function main() {
    if (process.env.NODE_ENV !== 'development') {
        console.log('This script is only for the development environment.');
        return;
    }

    await mongoose.connect(process.env.MONGO_DB);
    console.log('Connected to MongoDB');

    // Drop collections
    await User.collection.drop().catch(() => console.log('User collection not found'));
    await Movie.collection.drop().catch(() => console.log('Movie collection not found'));
    await Review.collection.drop().catch(() => console.log('Review collection not found'));
    await Actor.collection.drop().catch(() => console.log('Actor collection not found'));
    await Recommendation.collection.drop().catch(() => console.log('Recommendation collection not found'));

    console.log('Collections dropped');

    // Load movies and additional data
    await loadMovies();
    await loadReviews();
    await loadActors();
    await loadActorDetails();
    await loadRecommendations();

    console.log('All data loaded');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

main().catch(err => console.error(err));
