import React from "react";
import { getMovies } from "../api/tmdb-api"; 
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import AddToWatchlistIcon from "../components/cardIcons/addToWatchlist";

const HomePage = () => {
  const { data, error, isLoading, isError } = useQuery("discover", getMovies);

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const movies = data?.results || data;

  return (
    <PageTemplate
      title="Discover Movies"
      movies={movies}
      action={(movie) => (
        <>
          <AddToFavoritesIcon movie={movie} />
          <AddToWatchlistIcon movie={movie} />
        </>
      )}
    />
  );
};

export default HomePage;
