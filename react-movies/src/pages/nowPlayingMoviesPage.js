import React from "react";
import { getNowPlayingMovies } from "../api/tmdb-api"; // 修改为后端 API
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import AddToWatchlistIcon from "../components/cardIcons/addToWatchlist";

const NowPlayingMoviesPage = () => {
  const { data, error, isLoading, isError } = useQuery("nowPlaying", getNowPlayingMovies);

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <PageTemplate
      title="Now Playing Movies"
      movies={data}
      action={(movie) => (
        <>
          <AddToFavoritesIcon movie={movie} />
          <AddToWatchlistIcon movie={movie} />
        </>
      )}
    />
  );
};

export default NowPlayingMoviesPage;
