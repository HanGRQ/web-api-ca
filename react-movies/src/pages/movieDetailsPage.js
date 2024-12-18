import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetails from "../components/movieDetails/";
import PageTemplate from "../components/templateMoviePage";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import { 
  getMovie, 
  getMovieCredits, 
  getMovieReviews, 
  getMovieRecommendations, 
  getSimilarMovies 
} from "../api/tmdb-api";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [drawerContent, setDrawerContent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: movie, error, isLoading, isError } = useQuery(["movie", { id }], () =>
    getMovie(id)
  );

  const { data: credits } = useQuery(["credits", { id }], () =>
    getMovieCredits(id)
  );

  const { data: reviews } = useQuery(["reviews", { id }], () =>
    getMovieReviews(id)
  );

  const { data: recommendations } = useQuery(["recommendations", { id }], () =>
    getMovieRecommendations(id)
  );

  const { data: similarMovies } = useQuery(["similarMovies", { id }], () =>
    getSimilarMovies(id)
  );

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const handleDrawerOpen = (content) => {
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <PageTemplate movie={movie}>
      <MovieDetails movie={movie} />

      <div style={{ marginTop: "20px" }}>
        <Button
          variant="outlined"
          onClick={() => handleDrawerOpen("credits")}
        >
          View Credits
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDrawerOpen("reviews")}
        >
          View Reviews
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDrawerOpen("recommendations")}
        >
          View Recommendations
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDrawerOpen("similar")}
        >
          View Similar Movies
        </Button>
      </div>

      <Drawer anchor="bottom" open={isDrawerOpen} onClose={handleDrawerClose}>
        <div style={{ padding: "20px", maxHeight: "50vh", overflowY: "auto" }}>
          {drawerContent === "credits" && (
            <div>
              <h3>Credits</h3>
              <ul>
                {credits?.cast.map((person) => (
                  <li key={person.id}>
                    {person.name} as {person.character}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawerContent === "reviews" && (
            <div>
              <h3>Reviews</h3>
              <ul>
                {reviews?.results.map((review) => (
                  <li key={review.id}>
                    <strong>{review.author}:</strong> {review.content}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawerContent === "recommendations" && (
            <div>
              <h3>Recommendations</h3>
              <ul>
                {recommendations?.results.map((rec) => (
                  <li key={rec.id}>
                    {rec.title} ({rec.release_date})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawerContent === "similar" && (
            <div>
              <h3>Similar Movies</h3>
              <ul>
                {similarMovies?.results.map((similar) => (
                  <li key={similar.id}>
                    {similar.title} ({similar.release_date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Drawer>
    </PageTemplate>
  );
};

export default MovieDetailsPage;
