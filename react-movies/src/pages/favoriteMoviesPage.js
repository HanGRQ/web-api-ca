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

  // Log the movieIds for debugging
  console.log("Favorite Movie IDs:", movieIds);

  // Use `useQueries` to fetch movies by their IDs
  const favoriteMovieQueries = useQueries(
    [...new Set(movieIds)].map((id) => ({
      queryKey: ["movie", { id }],
      queryFn: getMovie,
    }))
  );

  // Check if queries are still loading
  const isLoading = favoriteMovieQueries.some((q) => q.isLoading);

  if (isLoading) {
    return <Spinner />;
  }

  // Extract movie data and ensure it is not null
  const movies = favoriteMovieQueries
  .map((q) => q.data)
  .filter((movie, index, self) => movie && self.findIndex(m => m.id === movie.id) === index);

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
      layoutConfig={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
    />
  );
};

export default FavoriteMoviesPage;