import React from "react";
import PageTemplate from "../components/templateActorPage"; 
import Spinner from "../components/spinner";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getActorDetails, getActorMovies } from "../api/tmdb-api";

const ActorDetailsPage = () => {
  const { id: actorId } = useParams();

  const { data: actor, error, isLoading, isError } = useQuery(
    ["actor", { id: actorId }],
    () => getActorDetails(actorId)
  );

  const { data: movies, isLoading: moviesLoading } = useQuery(
    ["actorMovies", { id: actorId }],
    () => getActorMovies(actorId)
  );

  if (isLoading || moviesLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <PageTemplate actor={actor}>
      <h2>{actor.name}</h2>
      <p>{actor.biography}</p>
      <h3>Movies</h3>
      <ul>
        {movies.cast.map((movie) => (
          <li key={movie.id}>
            {movie.title} ({movie.release_date})
          </li>
        ))}
      </ul>
    </PageTemplate>
  );
};

export default ActorDetailsPage;
