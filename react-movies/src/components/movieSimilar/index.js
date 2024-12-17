import Table from "@mui/material/Table"; 
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getSimilarMovies } from "../../api/tmdb-api"; // 确保此 API 已定义
import Spinner from '../spinner';

export default function MovieSimilar({ movie }) {
  const { data, error, isLoading, isError } = useQuery(
    ["similarMovies", { id: movie.id }],
    getSimilarMovies
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const similarMovies = data.results;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} aria-label="similar movies table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="center">Release Date</TableCell>
            <TableCell align="right">More Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {similarMovies.map((sim) => (
            <TableRow key={sim.id}>
              <TableCell component="th" scope="row">
                {sim.title}
              </TableCell>
              <TableCell align="center">{sim.release_date}</TableCell>
              <TableCell align="right">
                <Link to={`/movies/${sim.id}`}>
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
