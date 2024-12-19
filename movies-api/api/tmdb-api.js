import fetch from 'node-fetch';

export const getMovies = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
        );

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message || 'Failed to fetch movies');
        }

        return await response.json(); 
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        throw error;
    }
};

export const getUpcomingMovies = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
        );

        if (!response.ok) {
            throw new Error(response.json().message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovieGenres = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error((await response.json()).message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovieReviews = async (movieId) => {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${process.env.TMDB_KEY}`;
        console.log('Fetching movie reviews from URL:', url); // 调试信息

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            console.error('Error response from TMDB:', error);
            throw new Error('Failed to fetch movie reviews');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        throw error;
    }
};


export const getMovieRecommendations = async (movieId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.TMDB_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch movie recommendations');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getMovieCredits = async (movieId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch movie credits');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getActorDetails = async (actorId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${actorId}?api_key=${process.env.TMDB_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch actor details');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getActorMovies = async (actorId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${process.env.TMDB_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch actor movies');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};