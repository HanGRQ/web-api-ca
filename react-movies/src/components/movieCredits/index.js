import Table from "@mui/material/Table";  
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "react-query";
import { getMovieCredits } from "../../api/tmdb-api"; 
import Spinner from '../spinner';
import { Link } from "react-router-dom"; 

export default function MovieCredits({ movie }) {
  const { data, error, isLoading, isError } = useQuery(
    ["credits", { id: movie.id }],
    getMovieCredits
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const credits = data.cast;

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
          {credits.map((credit) => (
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
