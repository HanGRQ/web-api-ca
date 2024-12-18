import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import users from './users';
import movies from './movies';
import User from '../api/users/userModel';
import Movie from '../api/movies/movieModel';
import Review from '../api/reviews/reviewModel';
import Actor from '../api/actors/actorModel';
import Recommendation from '../api/recommendations/recommendationModel';
import { getMovieReviews, getActorDetails, getActorMovies, getMovieRecommendations } from '../api/tmdb-api.js';

async function loadReviews() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        const reviewsData = await getMovieReviews(movie.id);
        for (const review of reviewsData.results) {
            await Review.create({
                movieId: movie.id,
                review: review.content,
                author: review.author,
                createdAt: review.created_at,
            });
        }
        console.log(`Reviews loaded for movie: ${movie.title}`);
    }
}

async function loadActors() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        const actorData = await getActorMovies(movie.id);
        for (const actor of actorData.cast) {
            await Actor.create({
                movieId: movie.id,
                actorId: actor.id,
                name: actor.name,
                character: actor.character,
            });
        }
        console.log(`Actors loaded for movie: ${movie.title}`);
    }
}

async function loadActorDetails() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        const actorsData = await getActorMovies(movie.id);
        for (const actor of actorsData.cast) {
            const actorDetails = await getActorDetails(actor.id); // 使用 getActorDetails
            await Actor.create({
                movieId: movie.id,
                actorId: actor.id,
                name: actor.name,
                character: actor.character,
                biography: actorDetails.biography,  // 假设 TMDB 返回 biography 字段
                birthday: actorDetails.birthday,
                profile_path: actorDetails.profile_path,
            });
            console.log(`Actor details loaded: ${actor.name}`);
        }
    }
}


async function loadRecommendations() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        const recommendationsData = await getMovieRecommendations({ queryKey: [null, { id: movie.id }] });
        await Recommendation.create({
            movieId: movie.id,
            recommendations: recommendationsData.results.map(rec => ({
                id: rec.id,
                title: rec.title,
                overview: rec.overview,
            })),
        });
        console.log(`Recommendations loaded for movie: ${movie.title}`);
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

    // Load users and movies
    await User.create(users);
    await Movie.create(movies);
    console.log('Database initialised');
    console.log(`${users.length} users loaded`);
    console.log(`${movies.length} movies loaded`);

    // Load reviews, actors, and recommendations
    await loadReviews();
    await loadActors();
    await loadActorDetails();
    await loadRecommendations();

    console.log('Additional data (reviews, actors, recommendations) loaded.');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

main().catch(err => console.error(err));
