import React from "react";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getActorMovies } from "../../api/tmdb-api";
import Spinner from "../spinner";

export default function ActorMovies({ actorId }) {
  const { data: movies, error, isLoading, isError } = useQuery(
    ["actorMovies", { id: actorId }],
    getActorMovies,
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

  if (!movies) {
    return (
      <Typography variant="h6" component="p">
        No movies available
      </Typography>
    );
  }

  const moviesList = movies.cast || movies;

  if (!moviesList || moviesList.length === 0) {
    return (
      <Typography variant="h6" component="p">
        No movies found for this actor
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} aria-label="movies table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="center">Character</TableCell>
            <TableCell align="right">More Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {moviesList.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell component="th" scope="row">
                {movie.title}
              </TableCell>
              <TableCell align="center">
                {movie.character || 'Unknown'}
              </TableCell>
              <TableCell align="right">
                <Link to={`/movies/${movie.id}`}>
                  Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}