const BASE_URL = "http://localhost:8080/api/movies"; // 后端 API 基础路径
const ACTOR_BASE_URL = "http://localhost:8080/api/actors"; // 演员相关 API 基础路径

// 获取电影列表
export const getMovies = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
};

// 获取单个电影详情
export const getMovie = async ({ queryKey }) => {
  const [, { id }] = queryKey; // 解构获取电影 ID
  const response = await fetch(`${BASE_URL}/${id}`); // 调用后端 API
  if (!response.ok) throw new Error(`Failed to fetch movie details for ID ${id}`);
  return response.json();
};

// 获取电影图片
export const getMovieImages = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const response = await fetch(`${BASE_URL}/${id}/images`); // 调用后端 API
  if (!response.ok) throw new Error(`Failed to fetch images for movie ID ${id}`);
  return response.json();
};

// 获取即将上映的电影
export const getUpcomingMovies = async () => {
    const response = await fetch(`${BASE_URL}/upcoming`);
    if (!response.ok) throw new Error("Failed to fetch upcoming movies");
    return response.json();
};

// 获取正在播放的电影
export const getNowPlayingMovies = async () => {
    const response = await fetch(`${BASE_URL}/now-playing`);
    if (!response.ok) throw new Error("Failed to fetch now-playing movies");
    return response.json();
};

// 获取流行电影
export const getTrendingMovies = async () => {
    const response = await fetch(`${BASE_URL}/trending`);
    if (!response.ok) throw new Error("Failed to fetch trending movies");
    return response.json();
};

// 获取电影分类（类型）
export const getGenres = async () => {
    const response = await fetch(`${BASE_URL}/genres`);
    if (!response.ok) throw new Error("Failed to fetch genres");
    return response.json();
};

// 获取电影评论
export const getMovieReviews = async ({ queryKey }) => {
    const [, { id }] = queryKey;
    const response = await fetch(`${BASE_URL}/${id}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
};

// 获取电影推荐
export const getMovieRecommendations = async ({ queryKey }) => {
    const [, { id }] = queryKey;
    const response = await fetch(`${BASE_URL}/${id}/recommendations`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    return response.json();
};

// 获取相似电影
export const getSimilarMovies = async ({ queryKey }) => {
    const [, { id }] = queryKey;
    const response = await fetch(`${BASE_URL}/${id}/similar`);
    if (!response.ok) throw new Error("Failed to fetch similar movies");
    return response.json();
};

// 获取电影的演职员信息
export const getMovieCredits = async ({ queryKey }) => {
    const [, { id }] = queryKey;
    const response = await fetch(`${BASE_URL}/${id}/credits`);
    if (!response.ok) throw new Error("Failed to fetch credits");
    return response.json();
};

// 获取演员详情
export const getActorDetails = async ({ queryKey }) => {
    const [, { id }] = queryKey;
    const response = await fetch(`${ACTOR_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch actor details");
    return response.json();
};

// 获取演员出演的电影
export const getActorMovies = async ({ queryKey }) => {
    const [, { id }] = queryKey;
    const response = await fetch(`${ACTOR_BASE_URL}/${id}/movies`);
    if (!response.ok) throw new Error("Failed to fetch actor movies");
    return response.json();
};

