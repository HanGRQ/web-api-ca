import React from "react";
import Table from "@mui/material/Table"; 
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "react-query";
import { getActorMovies } from "../../api/tmdb-api";  
import Spinner from "../spinner";

export default function ActorMovies({ actorId }) {
  const { data: movies, isLoading, isError } = useQuery(
    ["actorMovies", { id: actorId }],
    () => getActorMovies(actorId)
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Typography variant="h5">Error fetching movies</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} aria-label="movies table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="center">Release Date</TableCell>
            <TableCell align="right">Character</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.cast.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell component="th" scope="row">
                {movie.title}
              </TableCell>
              <TableCell align="center">{movie.release_date}</TableCell>
              <TableCell align="right">{movie.character}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
