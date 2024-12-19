import React from "react";
import PageTemplate from "../components/templateActorPage";
import Spinner from "../components/spinner";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getActorDetails, getActorMovies } from "../api/tmdb-api"; // 修改为后端 API

const ActorDetailsPage = () => {
  const { id } = useParams();

  const { data: actor, isLoading: actorLoading } = useQuery(["actor", { id }], () =>
    getActorDetails(id)
  );
  const { data: movies } = useQuery(["actorMovies", { id }], () => getActorMovies(id));

  if (actorLoading) return <Spinner />;

  return (
    <PageTemplate actor={actor}>
      <h2>{actor.name}</h2>
      <p>{actor.biography}</p>
      <h3>Movies</h3>
      <ul>
        {movies?.map((movie) => (
          <li key={movie.id}>
            {movie.title} ({movie.release_date})
          </li>
        ))}
      </ul>
    </PageTemplate>
  );
};

export default ActorDetailsPage;
