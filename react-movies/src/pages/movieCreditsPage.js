import React from "react";
import PageTemplate from "../components/templateMoviePage";
import Spinner from "../components/spinner";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getMovieCredits } from "../api/tmdb-api";

const MovieCreditsPage = () => {
  const { id: movieId } = useParams();

  const { data: credits, error, isLoading, isError } = useQuery(
    ["credits", { id: movieId }],
    () => getMovieCredits(movieId)
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <PageTemplate movie={{ id: movieId }}>
      <h2>Credits</h2>
      <ul>
        {credits.cast.map((castMember) => (
          <li key={castMember.id}>
            {castMember.name} as {castMember.character}
          </li>
        ))}
      </ul>
    </PageTemplate>
  );
};

export default MovieCreditsPage;
