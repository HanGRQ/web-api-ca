import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../api/users/userModel';
import Movie from '../api/movies/movieModel';
import Review from '../api/reviews/reviewModel';
import Actor from '../api/actor/actorModel';
import Credit from '../api/credits/creditModel'; 
import Recommendation from '../api/recommendations/recommendationModel';
import SimilarMovie from '../api/similar/similarMovieModel';
import { 
    getMovies, 
    getMovieReviews, 
    getActorDetails, 
    getActorMovies, 
    getMovieRecommendations, 
    getSimilarMovies,
    getMovieCredits 
} from '../api/tmdb-api.js';

// 加载电影数据
async function loadMovies() {
    try {
        const moviesData = await getMovies();
        for (const movie of moviesData.results) {
            if (!movie.id) {
                console.error(`Movie missing id: ${JSON.stringify(movie)}`);
                continue;
            }

            await Movie.create({
                id: movie.id,
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

// 加载电影评论数据
async function loadReviews() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        try {
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

async function loadCredits() {
    const moviesInDB = await Movie.find(); // 从数据库获取所有电影
    for (const movie of moviesInDB) {
        try {
            const creditsData = await getMovieCredits(movie.id); // 获取 TMDB 的 credits 数据
            if (!creditsData || (!creditsData.cast && !creditsData.crew)) continue;

            await Credit.create({
                movieId: movie.id,
                cast: creditsData.cast.map((actor) => ({
                    actorId: actor.id,
                    name: actor.name || 'Unknown',
                    character: actor.character || 'Unknown',
                    profile_path: actor.profile_path || null,
                })),
                crew: creditsData.crew.map((crewMember) => ({
                    crewId: crewMember.id,
                    name: crewMember.name || 'Unknown',
                    job: crewMember.job || 'Unknown',
                    department: crewMember.department || 'Unknown',
                })),
            });

            console.log(`Credits loaded for movie: ${movie.title}`);
        } catch (err) {
            console.error(`Error fetching credits for movie ${movie.title}:`, err.message);
        }
    }
}


// 加载电影中的演员
async function loadActors() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        try {
            const actorData = await getMovieCredits(movie.id);
            if (!actorData || !actorData.cast) continue;

            for (const actor of actorData.cast) {
                await Actor.updateOne(
                    { actorId: actor.id },
                    {
                        actorId: actor.id,
                        name: actor.name || 'Unknown',
                        character: actor.character || 'Unknown',
                        profile_path: actor.profile_path || null,
                    },
                    { upsert: true } // 如果不存在则插入
                );
            }
            console.log(`Actors loaded for movie: ${movie.title}`);
        } catch (err) {
            console.error(`Error fetching actors for movie ${movie.title}:`, err.message);
        }
    }
}

// 加载演员详细信息
async function loadActorDetails() {
    const actorsInDB = await Actor.find();
    for (const actor of actorsInDB) {
        try {
            const actorDetails = await getActorDetails(actor.actorId);
            if (!actorDetails) continue;

            await Actor.updateOne(
                { actorId: actor.actorId },
                {
                    biography: actorDetails.biography || 'Biography not available',
                    birthday: actorDetails.birthday || 'Unknown',
                    profile_path: actorDetails.profile_path || actor.profile_path || null,
                }
            );
            console.log(`Actor details updated: ${actor.name}`);
        } catch (err) {
            console.error(`Error fetching details for actor ${actor.name}:`, err.message);
        }
    }
}

// 加载演员参演的电影
async function loadActorMovies() {
    const actorsInDB = await Actor.find();
    for (const actor of actorsInDB) {
        try {
            const moviesData = await getActorMovies(actor.actorId);
            if (!moviesData || !moviesData.cast) continue;

            actor.movies = moviesData.cast.map((movie) => ({
                movieId: movie.id,
                title: movie.title || 'Unknown',
                character: movie.character || 'Unknown',
            }));
            await actor.save();
            console.log(`Movies loaded for actor: ${actor.name}`);
        } catch (err) {
            console.error(`Error fetching movies for actor ${actor.name}:`, err.message);
        }
    }
}

// 加载推荐电影
async function loadRecommendations() {
    const moviesInDB = await Movie.find();
    for (const movie of moviesInDB) {
        try {
            const recommendationsData = await getMovieRecommendations(movie.id);
            if (!recommendationsData || !recommendationsData.results) continue;

            await Recommendation.create({
                movieId: movie.id,
                recommendations: recommendationsData.results.map((recMovie) => ({
                    movieId: recMovie.id,
                    title: recMovie.title || 'No title available',
                    overview: recMovie.overview || 'No overview available',
                    poster_path: recMovie.poster_path || null,
                    release_date: recMovie.release_date || 'Unknown',
                })),
            });
            console.log(`Recommendations loaded for movie: ${movie.title}`);
        } catch (err) {
            console.error(`Error fetching recommendations for movie ${movie.title}:`, err.message);
        }
    }
}

async function loadSimilarMovies() {
    const moviesInDB = await Movie.find(); // 从数据库获取所有电影
    for (const movie of moviesInDB) {
        try {
            if (!movie.id) {
                console.error(`Movie in DB missing id: ${movie.title}`);
                continue; // 跳过没有 ID 的电影
            }

            // 检查数据库中是否已存在类似电影数据
            const similarMoviesInDB = await SimilarMovie.findOne({ movieId: movie.id });
            if (similarMoviesInDB) {
                console.log(`Similar movies for movie ${movie.title} already loaded`);
                continue; // 跳过已存在的记录
            }

            // 从 TMDB 获取类似电影数据
            const similarMoviesData = await getSimilarMovies(movie.id);
            if (!similarMoviesData || !similarMoviesData.results || similarMoviesData.results.length === 0) {
                console.error(`No similar movies found for movie: ${movie.title}`);
                continue;
            }

            // 存储类似电影数据到数据库
            await SimilarMovie.create({
                movieId: movie.id,
                similarMovies: similarMoviesData.results.map((similarMovie) => ({
                    movieId: similarMovie.id,
                    title: similarMovie.title || 'No title available',
                    overview: similarMovie.overview || 'No overview available',
                    poster_path: similarMovie.poster_path || null,
                    release_date: similarMovie.release_date || 'Unknown',
                })),
            });

            console.log(`Similar movies loaded for movie: ${movie.title}`);
        } catch (err) {
            console.error(`Error fetching similar movies for movie ${movie.title}:`, err.message);
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

    await Promise.all([
        User.collection.drop().catch(() => console.log('User collection not found')),
        Movie.collection.drop().catch(() => console.log('Movie collection not found')),
        Review.collection.drop().catch(() => console.log('Review collection not found')),
        Actor.collection.drop().catch(() => console.log('Actor collection not found')),
        Recommendation.collection.drop().catch(() => console.log('Recommendation collection not found')),
        Credit.collection.drop().catch(() => console.log('Credit collection not found')), 
        SimilarMovie.collection.drop().catch(() => console.log('SimilarMovie collection not found')),
    ]);

    console.log('Collections dropped');

    await loadMovies();
    await loadReviews();
    await loadCredits(); 
    await loadActors();
    await loadActorDetails();
    await loadActorMovies();
    await loadRecommendations();
    await loadSimilarMovies();

    console.log('All data loaded');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}


main().catch((err) => console.error(err));
