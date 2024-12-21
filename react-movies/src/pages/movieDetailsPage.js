import React from "react";
import { useParams } from "react-router-dom";
import MovieDetails from "../components/movieDetails/";
import PageTemplate from "../components/templateMoviePage";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import { 
  getMovie, 
  getMovieImages
} from "../api/tmdb-api";


const MovieDetailsPage = () => {
  const { id } = useParams();
  const movieId = String(id);


  // 修改所有的 useQuery 调用，直接传递 id 参数给 API 函数
  const { data: movie, error, isLoading, isError } = useQuery(
    ["movie", movieId],
    () => getMovie(movieId),
    {
      enabled: !!id
    }
  );

  const { data: images } = useQuery(
    ["images", movieId],
    () => getMovieImages,
    {
      enabled: Boolean(movieId),
      retry: false
    }
  );

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <PageTemplate movie={movie}>
      <MovieDetails movie={movie} image={images}/>
    </PageTemplate>
  );
};

export default MovieDetailsPage;
