import React from "react";
import PageTemplate from "../components/templateMoviePage";
import Spinner from "../components/spinner";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getMovieRecommendations } from "../api/tmdb-api";

const MovieRecommendationsPage = () => {
  const { id: movieId } = useParams();

  const { data: recommendations, error, isLoading, isError } = useQuery(
    ["recommendations", { id: movieId }],
    () => getMovieRecommendations(movieId)
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <PageTemplate movie={{ id: movieId }}>
      <h2>Recommendations</h2>
      <ul>
        {recommendations.results.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </PageTemplate>
  );
};

export default MovieRecommendationsPage;
