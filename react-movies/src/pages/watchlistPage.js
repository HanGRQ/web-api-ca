import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromWatchlist from "../components/cardIcons/removeFromWatchlist";

const WatchlistPage = () => {
  const { watchlist: movieIds } = useContext(MoviesContext);

  const watchlistMovieQueries = useQueries(
    movieIds.map((movieId) => ({
      queryKey: ["movie", { id: movieId }],
      queryFn: getMovie,
    }))
  );

  const isLoading = watchlistMovieQueries.some((q) => q.isLoading);

  if (isLoading) {
    return <Spinner />;
  }

  const movies = watchlistMovieQueries.map((q) => {
    if (q.data) {
      q.data.genre_ids = q.data.genres.map((g) => g.id);
      return q.data;
    }
    return null;
  }).filter((movie) => movie !== null);

  console.log("Loaded Movies:", movies);

  return (
    <PageTemplate
      title="My Watchlist"
      movies={movies}
      action={(movie) => (
        <>
          <RemoveFromWatchlist movie={movie} />
        </>
      )}
      layoutConfig={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
    />
  );
};

export default WatchlistPage;
