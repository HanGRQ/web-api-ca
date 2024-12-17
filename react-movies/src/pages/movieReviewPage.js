import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import PageTemplate from "../components/templateMoviePage";
import MovieReview from "../components/movieReview";
import { getMovie, getMovieReviews } from "../api/tmdb-api";

const MovieReviewPage = () => {
  const { movieId, reviewId } = useParams();

  const { data: movie, isLoading: movieLoading, error: movieError } = useQuery(
    ["movie", { id: movieId }],
    getMovie
  );

  const { data: reviewData, isLoading: reviewLoading, error: reviewError } = useQuery(
    ["reviews", { id: movieId }],
    getMovieReviews
  );

  if (movieLoading || reviewLoading) return <p>Loading...</p>;
  if (movieError) return <p>Error loading movie: {movieError.message}</p>;
  if (reviewError) return <p>Error loading review: {reviewError.message}</p>;

  const review = reviewData?.results.find((r) => r.id === reviewId);

  return (
    <PageTemplate movie={movie}>
      <MovieReview review={review} />
    </PageTemplate>
  );
};

export default MovieReviewPage;
