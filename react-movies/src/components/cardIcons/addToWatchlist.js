import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { MoviesContext } from "../../contexts/moviesContext";

const AddToWatchlistIcon = ({ movie }) => {
  const { addToWatchlist } = useContext(MoviesContext);

  const handleAddToWatchlist = (e) => {
    e.preventDefault();
    addToWatchlist(movie);
  };

  return (
    <IconButton
      aria-label="add to watchlist"
      onClick={handleAddToWatchlist}
      color="primary"
    >
      <PlaylistAddIcon />
    </IconButton>
  );
};

export default AddToWatchlistIcon;
