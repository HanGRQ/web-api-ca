import React, {useState} from "react";
import { getUpcomingMovies } from "../api/tmdb-api"; 
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import AddToWatchlistIcon from "../components/cardIcons/addToWatchlist";

const UpcomingMoviesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  console.log("Current page:", currentPage); // 应输出数字，例如 1, 2, 3


  const { data, error, isLoading, isError } = useQuery(
    ["upcoming", currentPage], 
    () => getUpcomingMovies(currentPage),
    { keepPreviousData: true }
  );

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const movies = data.results || [];
  const page = data.page;
  const totalPages = data.total_pages || 1;
  const total_results = data.total_results;

  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))

  return (
    <PageTemplate
      title="Upcoming Movies"
      movies={movies}
      page={page}
      totalPages={totalPages} 
      total_results={total_results}
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

export default UpcomingMoviesPage;
