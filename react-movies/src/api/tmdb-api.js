const BASE_URL = "http://localhost:8080/api/movies"; // Backend API base path
const ACTOR_BASE_URL = "http://localhost:8080/api/actors"; // Actor API base path

// Fetch movie list with pagination
export const getMovies = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  const data = await response.json();
  if (!Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return data.results;
};


// Fetch single movie details
export const getMovie = async (param) => {
  let movieId;

  // Handle React Query `queryKey` or direct movie ID
  if (typeof param === "object" && param.queryKey) {
    const [, { id }] = param.queryKey; // Extract movie ID from queryKey
    movieId = id;
  } else {
    movieId = param; // Direct movie ID
  }

  if (!movieId) throw new Error("Movie ID is required for fetching details.");

  const response = await fetch(`${BASE_URL}/${movieId}`);
  if (!response.ok) throw new Error("Failed to fetch movie details.");

  const movie = await response.json();

  // Validate movie structure
  if (!movie || !movie.title) {
    throw new Error("Invalid movie data: Missing 'title'.");
  }

  return movie;
};



// Fetch movie images
export const getMovieImages = async ({ queryKey }) => {
  if (!queryKey || queryKey.length < 2) {
    throw new Error("Invalid queryKey: queryKey is undefined or incomplete.");
  }
  
  const [, { id }] = queryKey; 
  
  if (!id) {
    throw new Error("Movie ID is required for fetching images.");
  }

  const response = await fetch(`${BASE_URL}/${id}/images`);
  if (!response.ok) {
    throw new Error(`Failed to fetch images for movie ID ${id}`);
  }
  return response.json();
};



// Fetch upcoming movies
export const getUpcomingMovies = async () => {
  const response = await fetch(`${BASE_URL}/tmdb/upcoming`);
  if (!response.ok) throw new Error("Failed to fetch upcoming movies");
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return data.results;
};

// Fetch now-playing movies
export const getNowPlayingMovies = async () => {
  const response = await fetch(`${BASE_URL}/tmdb/now-playing`);
  if (!response.ok) throw new Error("Failed to fetch now-playing movies");
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return data.results;
};

// Fetch trending movies
export const getTrendingMovies = async () => {
  const response = await fetch(`${BASE_URL}/tmdb/trending`);
  if (!response.ok) throw new Error("Failed to fetch trending movies");
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return data.results;
};

// Fetch movie genres
export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/tmdb/genres`);
  if (!response.ok) throw new Error("Failed to fetch genres");
  return response.json();
};

// Fetch movie reviews
export const getMovieReviews = async ({ queryKey }) => {
  const [, { id }] = queryKey; // Ensure `queryKey` is properly destructured
  const response = await fetch(`http://localhost:8080/api/movies/${id}/reviews`);

  if (!response.ok) {
      throw new Error(`Failed to fetch reviews for movie ID ${id}`);
  }

  const data = await response.json();

  // Validate response structure
  if (!data || !Array.isArray(data.results)) {
      throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return data;
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
