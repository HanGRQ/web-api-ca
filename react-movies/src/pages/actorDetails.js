import React from "react";
import PageTemplate from "../components/templateActorPage";
import Spinner from "../components/spinner";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getActorDetails } from "../api/tmdb-api";
import Typography from "@mui/material/Typography";
import ActorMovies from "../components/actorMovies";  

const ActorDetailsPage = () => {
  const { id } = useParams();

  const { 
    data: actor, 
    error: actorError, 
    isLoading: isActorLoading, 
    isError: isActorError 
  } = useQuery(
    ["actor", { id }],
    getActorDetails,
    {
      enabled: !!id,
    }
  );

  if (!id) {
    return (
      <Typography variant="h6" component="p">
        No actor ID provided
      </Typography>
    );
  }

  if (isActorLoading) {
    return <Spinner />;
  }

  if (isActorError) {
    return <Typography variant="h5">Error: {actorError.message}</Typography>;
  }

  if (!actor) {
    return (
      <Typography variant="h6" component="p">
        No actor details available
      </Typography>
    );
  }

  return (
    <PageTemplate actor={actor}>
      <Typography variant="h4" component="h3" sx={{ mt: 4, mb: 2 }}>
        Movies
      </Typography>

      <ActorMovies actorId={id} />
    </PageTemplate>
  );
};

export default ActorDetailsPage;