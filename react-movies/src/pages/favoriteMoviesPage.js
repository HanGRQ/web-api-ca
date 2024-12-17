import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import WriteReview from "../components/cardIcons/writeReview";

const FavoriteMoviesPage = () => {
  const { favorites: movieIds } = useContext(MoviesContext);

  // 使用 useQueries 获取电影数据
  const favoriteMovieQueries = useQueries(
    movieIds.map((movieId) => ({
      queryKey: ["movie", { id: movieId }],
      queryFn: getMovie,
    }))
  );

  // 检查是否仍有数据在加载中
  const isLoading = favoriteMovieQueries.some((q) => q.isLoading);

  if (isLoading) {
    return <Spinner />;
  }

  // 提取电影数据，并处理 genre_ids
  const movies = favoriteMovieQueries.map((q) => {
    if (q.data) {
      q.data.genre_ids = q.data.genres.map((g) => g.id);
      return q.data;
    }
    return null;
  }).filter((movie) => movie !== null);

  console.log("Loaded Movies:", movies);

  return (
    <PageTemplate
      title="Favorite Movies"
      movies={movies}
      action={(movie) => (
        <>
          <RemoveFromFavorites movie={movie} />
          <WriteReview movie={movie} />
        </>
      )}
      layoutConfig={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
    />
  );
};

export default FavoriteMoviesPage;
