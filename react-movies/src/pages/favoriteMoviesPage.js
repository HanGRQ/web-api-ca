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

  const uniqueIds = [...new Set(movieIds)];

  const favoriteMovieQueries = useQueries(
    uniqueIds.map((movieId) => ({
      queryKey: ["movie", { id: movieId }],
      queryFn: () => getMovie(movieId),
    }))
  );

  const isLoading = favoriteMovieQueries.some((q) => q.isLoading);

  if (isLoading) {
    return <Spinner />;
  }

  const allMovies = favoriteMovieQueries
    .filter((query) => query.data)
    .map((query) => query.data);

  const movies = [...new Map(allMovies.map(movie => [movie.id, movie])).values()];

  if (movies.length === 0) {
    return <h2>No favorite movies added yet!</h2>;
  }

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
    />
  );
};

export default FavoriteMoviesPage;