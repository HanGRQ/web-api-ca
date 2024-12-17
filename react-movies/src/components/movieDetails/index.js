import React, { useState } from "react"; 
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import LanguageIcon from "@mui/icons-material/Language";
import MovieReviews from "../movieReviews";
import MovieRecommendations from "../movieRecommendations"; 
import MovieCredits from "../movieCredits"; 
import MovieSimilar from "../movieSimilar";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";


const root = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 1.5,
  margin: 0,
};
const chip = { margin: 0.5 };

const MovieDetails = ({ movie }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);

  return (
    <>
      <Typography variant="h5" component="h3">
        Overview
      </Typography>

      <Typography variant="h6" component="p">
        {movie.overview}
      </Typography>

      <Paper component="ul" sx={{ ...root }}>
        <li>
          <Chip label="Genres" sx={{ ...chip }} color="primary" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{ ...chip }} />
          </li>
        ))}
      </Paper>

      <Paper component="ul" sx={{ ...root }}>
        <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
        <Chip icon={<MonetizationIcon />} label={`${movie.revenue.toLocaleString()}`} />
        <Chip icon={<StarRate />} label={`${movie.vote_average} (${movie.vote_count})`} />
        <Chip icon={<LanguageIcon />} label={`Original Language: ${movie.original_language}`} sx={{ ...chip }} />
        <Chip label={`Released: ${movie.release_date}`} />
      </Paper>

      <Paper component="ul" sx={{ ...root }}>
        <li>
          <Chip label="Production Countries" sx={{ ...chip }} color="primary" />
        </li>
        {movie.production_countries.map((country) => (
          <li key={country.name}>
            <Chip label={country.name} sx={{ ...chip }} />
          </li>
        ))}
      </Paper>

      {/* 分享按钮 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginTop: 4,
          padding: 2,
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" component="p">
          Share this movie:
        </Typography>
        <FacebookShareButton
          url={`https://www.themoviedb.org/movie/${movie.id}`}
          quote={`Check out this amazing movie: ${movie.title}`}
          hashtag="#TMDB"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={`https://www.themoviedb.org/movie/${movie.id}`}
          title={`Check out this amazing movie: ${movie.title}`}
          hashtags={["TMDB", "Movies"]}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </Box>

      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

      {/* Floating Buttons */}
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '10em',
          right: '1em',
          backgroundColor: 'purple', 
          height: '30px',
        }}
      >
        <NavigationIcon />
        Reviews
      </Fab>

      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setCreditsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '7em',
          right: '1em',
          backgroundColor: 'purple', 
          height: '30px',
        }}
      >
        <NavigationIcon />
        Credits
      </Fab>

      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setSimilarOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '4em',
          right: '1em',
          backgroundColor: 'purple', 
          height: '30px',
        }}
      >
        <NavigationIcon />
        Similar
      </Fab>

      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setRecommendationsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '1em',
          right: '1em',
          backgroundColor: 'purple', 
          height: '30px',
        }}
      >
        <NavigationIcon />
        Recommendations
      </Fab>

      {/* Drawers */}
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={movie} />
      </Drawer>

      <Drawer anchor="top" open={creditsOpen} onClose={() => setCreditsOpen(false)}>
        <MovieCredits movie={movie} />
      </Drawer>

      <Drawer anchor="top" open={similarOpen} onClose={() => setSimilarOpen(false)}>
        <MovieSimilar movie={movie} />
      </Drawer>

      <Drawer anchor="top" open={recommendationsOpen} onClose={() => setRecommendationsOpen(false)}>
        <MovieRecommendations movie={movie} />
      </Drawer>
    </>
  );
};

export default MovieDetails;
