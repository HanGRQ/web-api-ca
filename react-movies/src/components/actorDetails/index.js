import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import NavigationIcon from "@mui/icons-material/Navigation";
import ActorMovies from "../actorMovies";
import { useQuery } from "react-query";
import { getActorDetails } from "../../api/tmdb-api";
import Spinner from "../spinner";

const root = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 1.5,
  margin: 0,
};
const chip = { margin: 0.5 };

const ActorDetails = ({ actorId }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: actor, error, isLoading, isError } = useQuery(
    ["actorDetails", { id: actorId }],
    getActorDetails,
    {
      enabled: !!actorId,
    }
  );

  if (!actorId) {
    return (
      <Typography variant="h6" component="p">
        No actor ID provided
      </Typography>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Typography variant="h5">Error: {error.message}</Typography>;
  }

  if (!actor) {
    return (
      <Typography variant="h6" component="p">
        No actor details available
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" component="h2">
        {actor.name}
      </Typography>

      <Typography variant="h6" component="p">
        {actor.biography || "No biography available"}
      </Typography>

      <Paper component="ul" sx={{ ...root }}>
        <li>
          <Chip 
            label={`Born: ${actor.birthday || 'Unknown'}`} 
            sx={{ ...chip }} 
          />
        </li>
        <li>
          <Chip 
            label={`Place of Birth: ${actor.place_of_birth || 'Unknown'}`} 
            sx={{ ...chip }} 
          />
        </li>
      </Paper>

      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '1em',
          right: '1em',
          backgroundColor: 'purple',
          height: '30px',
        }}
      >
        <NavigationIcon />
        Movies
      </Fab>

      <Drawer 
        anchor="top" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
      >
        {actorId && <ActorMovies actorId={actorId} />}
      </Drawer>
    </>
  );
};

export default ActorDetails;