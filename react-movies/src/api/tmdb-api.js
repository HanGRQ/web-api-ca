const BASE_URL = "http://localhost:8080/api/movies"; // Backend API base path
const ACTOR_BASE_URL = "http://localhost:8080/api/actors"; // Actor API base path


// Fetch movie list with pagination
export const getMovies = async (page = 1, limit = 8) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  const data = await response.json();
  if (!Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results
  };
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
  const [, { id }] = queryKey || [null, { id: null }];
  
  if (!id) {
    throw new Error('Movie ID is required to fetch images');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/${id}/images`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie images');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch movie images');
  }
};



// Fetch upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/tmdb/upcoming?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch upcoming movies");
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  // 返回完整的分页数据
  return {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results
  };
};


// Fetch now-playing movies
export const getNowPlayingMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/tmdb/now-playing?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch now-playing movies");
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return {
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results
  };
};


// Fetch trending movies
export const getTrendingMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/tmdb/trending?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch trending movies");
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid response structure: Missing or invalid 'results'");
  }

  return {
    results: data.results,
    totalPages: data.total_pages || 1,
  };
};


// Fetch movie genres
export const getGenres = async () => {
  try {
    console.log('Fetching genres...');
    const response = await fetch(`${BASE_URL}/tmdb/genres`);
    console.log('Genre response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || 'Failed to fetch genres');
    }

    const data = await response.json();
    console.log('Received genres data:', data);
    
    // 确保返回的数据格式正确
    return {
      genres: Array.isArray(data) ? data : data.genres || []
    };
  } catch (error) {
    console.error('Genre fetch error:', error);
    throw new Error(error.message || 'Failed to fetch genres');
  }
};

// Fetch movie reviews
export const getMovieReviews = ({ queryKey }) => {
  const [, { id }] = queryKey;
  return fetch(`${BASE_URL}/${id}/reviews`, {
    headers: {
      'Authorization': 'Bearer your-auth-token',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((error) => {
        throw new Error(error.status_message || "Something went wrong");
      });
    }
    return response.json();
  })
  .catch((error) => {
    throw error;
  });
};


export const getMovieRecommendations = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const response = await fetch(
    `${BASE_URL}/${id}/recommendations`
  );
  if (!response.ok) {
    return response.json().then((error) => {
      throw new Error(error.status_message || "Something went wrong");
    });
  }
  return response.json();
};

export const getSimilarMovies = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  if (!id) throw new Error("Movie ID is required for fetching similar movies.");
  const response = await fetch(`${BASE_URL}/${id}/similar`);
  if (!response.ok) {
    throw new Error(`Failed to fetch similar movies for movie ID ${id}`);
  }
  return response.json();
};

export const getMovieCredits = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  if (!id) throw new Error("Movie ID is required for fetching credits.");
  const response = await fetch(`${BASE_URL}/${id}/credits`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie credits.");
  }
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