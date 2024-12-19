import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import PageTemplate from "../components/templateMoviePage";
import MovieReview from "../components/movieReview";
import { getMovie, getMovieReviews } from "../api/tmdb-api"; // 修改为后端 API

const MovieReviewPage = () => {
  const { movieId, reviewId } = useParams();

  const { data: movie, isLoading: movieLoading } = useQuery(["movie", { id: movieId }], () =>
    getMovie(movieId)
  );
  const { data: reviews } = useQuery(["reviews", { id: movieId }], () => getMovieReviews(movieId));

  if (movieLoading) return <p>Loading...</p>;

  const review = reviews?.find((r) => r.id === reviewId);

  return (
    <PageTemplate movie={movie}>
      <MovieReview review={review} />
    </PageTemplate>
  );
};

export default MovieReviewPage;
