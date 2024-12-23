import React, {useState} from "react";
import { getTrendingMovies } from "../api/tmdb-api"; 
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import AddToWatchlistIcon from "../components/cardIcons/addToWatchlist";

const TrendingMoviesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading, isError } = useQuery(
    ["Trending", currentPage], 
    () => getTrendingMovies(currentPage),
    { keepPreviousData: true }
  );

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const movies = data.results || [];

  const totalPages = data.total_pages || 1;

  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))

  return (
    <PageTemplate
      title="Trending Movies"
      movies={movies}
      totalPages={totalPages} 
      onPageChange={(page) => setCurrentPage(page)}
      action={(movie) => (
        <>
          <AddToFavoritesIcon movie={movie} />
          <AddToWatchlistIcon movie={movie} />
        </>
      )}
    />
  );
};

export default TrendingMoviesPage;
