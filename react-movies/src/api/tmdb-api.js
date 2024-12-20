const BASE_URL = "http://localhost:8080/api/movies"; // Backend API base path
const ACTOR_BASE_URL = "http://localhost:8080/api/actors"; // Actor API base path

// Fetch movie list with pagination
export const getMovies = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
};

// Fetch single movie details
export const getMovie = async (movieId) => {
  if (!movieId) throw new Error("Movie ID is required for fetching details.");
  const response = await fetch(`${BASE_URL}/${movieId}`);
  if (!response.ok) throw new Error("Failed to fetch movie details.");
  return response.json();
};

// Fetch movie images
export const getMovieImages = async (param) => {
  let movieId;

  if (typeof param === 'object' && Array.isArray(param.queryKey)) {
    // Extract movieId from queryKey
    movieId = param.queryKey[1]?.id;
  } else if (typeof param === 'object' && param.id) {
    // Handle direct object with id property
    movieId = param.id;
  } else {
    // Assume param is the movieId
    movieId = param;
  }

  if (!movieId) {
    throw new Error("Movie ID is required for fetching images.");
  }

  const id = String(movieId);

  try {
    const response = await fetch(`${BASE_URL}/${id}/images`);
    if (!response.ok) {
      throw new Error(`Failed to fetch images for movie ID ${id}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching movie images:', error.message);
    throw error;
  }
};


// Fetch upcoming movies
export const getUpcomingMovies = async () => {
  const response = await fetch(`${BASE_URL}/tmdb/upcoming`);
  if (!response.ok) throw new Error("Failed to fetch upcoming movies");
  return response.json();
};

// Fetch now-playing movies
export const getNowPlayingMovies = async () => {
  const response = await fetch(`${BASE_URL}/now-playing`);
  if (!response.ok) throw new Error("Failed to fetch now-playing movies");
  return response.json();
};

// Fetch trending movies
export const getTrendingMovies = async () => {
  const response = await fetch(`${BASE_URL}/trending`);
  if (!response.ok) throw new Error("Failed to fetch trending movies");
  return response.json();
};

// Fetch movie genres
export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genres`);
  if (!response.ok) throw new Error("Failed to fetch genres");
  return response.json();
};

// Fetch movie reviews
export const getMovieReviews = async (movieId) => {
  if (!movieId) throw new Error("Movie ID is required for fetching reviews.");
  const response = await fetch(`${BASE_URL}/${movieId}/reviews`);
  if (!response.ok) throw new Error(`Failed to fetch reviews for movie ID ${movieId}`);
  return response.json();
};

// Fetch movie recommendations
export const getMovieRecommendations = async (movieId) => {
  if (!movieId) throw new Error("Movie ID is required for fetching recommendations.");
  const response = await fetch(`${BASE_URL}/${movieId}/recommendations`);
  if (!response.ok) throw new Error(`Failed to fetch recommendations for movie ID ${movieId}`);
  return response.json();
};

// Fetch similar movies
export const getSimilarMovies = async (movieId) => {
  if (!movieId) throw new Error("Movie ID is required for fetching similar movies.");
  const response = await fetch(`${BASE_URL}/${movieId}/similar`);
  if (!response.ok) throw new Error(`Failed to fetch similar movies for movie ID ${movieId}`);
  return response.json();
};

// Fetch movie credits
export const getMovieCredits = async (movieId) => {
  if (!movieId) throw new Error("Movie ID is required for fetching credits.");
  const response = await fetch(`${BASE_URL}/${movieId}/credits`);
  if (!response.ok) throw new Error("Failed to fetch movie credits.");
  return response.json();
};

// Fetch actor details
export const getActorDetails = async ({ queryKey = [] }) => {
  const [, { id } = {}] = queryKey;
  if (!id) throw new Error("Actor ID is required for fetching details.");
  const response = await fetch(`${ACTOR_BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch actor details");
  return response.json();
};

// Fetch actor movies
export const getActorMovies = async ({ queryKey = [] }) => {
  const [, { id } = {}] = queryKey;
  if (!id) throw new Error("Actor ID is required for fetching movies.");
  const response = await fetch(`${ACTOR_BASE_URL}/${id}/movies`);
  if (!response.ok) throw new Error("Failed to fetch actor movies");
  return response.json();
};
