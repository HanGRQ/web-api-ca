import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { getMovieReviews } from "../../api/tmdb-api";
import { excerpt } from "../../util";
import { useQuery } from "react-query";
import Spinner from "../spinner";
import Typography from "@mui/material/Typography";

export default function MovieReviews({ movie }) {

  const { data: reviews, error, isLoading, isError } = useQuery(
    ["reviews", { id: movie.id }],
    getMovieReviews,
    {
      enabled: !!movie.id,
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

  if (!reviews) {
    return (
      <Typography variant="h6" component="p">
        No reviews available
      </Typography>
    );
  }

  const reviewsData = reviews.results || reviews;

  if (!reviewsData || reviewsData.length === 0) {
    return (
      <Typography variant="h6" component="p">
        No reviews available for this movie
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} aria-label="reviews table">
        <TableHead>
          <TableRow>
            <TableCell>Author</TableCell>
            <TableCell align="center">Excerpt</TableCell>
            <TableCell align="right">More</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviewsData.map((r) => (
            <TableRow key={r.id}>
              <TableCell component="th" scope="row">
                {r.author}
              </TableCell>
              <TableCell>{excerpt(r.content)}</TableCell>
              <TableCell>
                <Link
                  to={`/reviews/${movie.id}/${r.id}`}
                  state={{
                    review: r,
                    movie: movie,
                  }}
                >
                  Full Review
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}