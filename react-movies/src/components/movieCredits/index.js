import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getMovieCredits } from "../../api/tmdb-api";
import Spinner from '../spinner';
import Typography from "@mui/material/Typography";

export default function MovieCredits({ movie }) {
  const { data: credits, error, isLoading, isError } = useQuery(
    ["credits", { id: movie?.id }],
    getMovieCredits,
    {
      enabled: !!movie?.id,
    }
  );

  if (!movie) {
    return (
      <Typography variant="h6" component="p">
        No movie data available
      </Typography>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  if (!credits) {
    return (
      <Typography variant="h6" component="p">
        No credits available
      </Typography>
    );
  }

  const castData = credits.cast || credits;

  if (!castData || castData.length === 0) {
    return (
      <Typography variant="h6" component="p">
        No cast information available for this movie
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} aria-label="credits table">
        <TableHead>
          <TableRow>
            <TableCell>Actor</TableCell>
            <TableCell align="center">Character</TableCell>
            <TableCell align="right">More Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {castData.map((credit) => (
            <TableRow key={credit.id}>
              <TableCell component="th" scope="row">
                <Link to={`/actor/${credit.id}`}>{credit.name}</Link>
              </TableCell>
              <TableCell align="center">{credit.character}</TableCell>
              <TableCell align="right">
                <Link to={`/actor/${credit.id}`}>Details</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}