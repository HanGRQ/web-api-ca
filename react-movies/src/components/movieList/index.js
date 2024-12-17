import React from "react";
import Movie from "../movieCard/";
import Grid from "@mui/material/Grid2";

const MovieList = ({ movies, action }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      {movies.map((movie) => (
        <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} sx={{ padding: "20px" }}>
          <Movie movie={movie} action={action} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieList;
