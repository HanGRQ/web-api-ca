import Table from "@mui/material/Table"; 
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getMovieRecommendations } from "../../api/tmdb-api"; // 假设此 API 已存在
import Spinner from '../spinner';

export default function MovieRecommendations({ movie }) {
  const { data, error, isLoading, isError } = useQuery(
    ["recommendations", { id: movie.id }],
    getMovieRecommendations
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const recommendations = data.results;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} aria-label="recommendations table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="center">Release Date</TableCell>
            <TableCell align="right">More Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recommendations.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell component="th" scope="row">
                {rec.title}
              </TableCell>
              <TableCell align="center">{rec.release_date}</TableCell>
              <TableCell align="right">
                <Link to={`/movies/${rec.id}`}>
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
