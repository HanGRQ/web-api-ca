import React from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";

const MovieReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Typography variant="h6" component="p">
        No reviews available for this movie.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: "16px" }}>
      <Typography variant="h5" component="h3" gutterBottom>
        Movie Reviews
      </Typography>
      <List>
        {reviews.map((review, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <Box display="flex" flexDirection="column" width="100%">
                {/* Author details */}
                <Box display="flex" alignItems="center" marginBottom="8px">
                  <Avatar
                    src={
                      review.author_details?.avatar_path
                        ? `https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`
                        : "/default-avatar.png" // Fallback if no avatar
                    }
                    alt={review.author}
                    sx={{ marginRight: "12px" }}
                  />
                  <Typography variant="subtitle1" component="span">
                    <strong>{review.author}</strong>
                  </Typography>
                </Box>

                {/* Review content */}
                <Typography variant="body1" component="p">
                  {review.content}
                </Typography>

                {/* Rating and date */}
                <Box display="flex" justifyContent="space-between" marginTop="8px">
                  <Typography variant="caption" color="text.secondary">
                    Rating: {review.author_details?.rating || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Posted: {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
            <Divider variant="fullWidth" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default MovieReviews;
