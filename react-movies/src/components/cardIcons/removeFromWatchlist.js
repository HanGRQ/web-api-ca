import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { MoviesContext } from "../../contexts/moviesContext";

const RemoveFromWatchlist = ({ movie }) => {
  const { removeFromWatchlist } = useContext(MoviesContext);

  const handleRemoveFromWatchlist = (e) => {
    e.preventDefault();
    removeFromWatchlist(movie);
  };

  return (
    <IconButton
      aria-label="remove from watchlist"
      onClick={handleRemoveFromWatchlist}
      color="secondary"
    >
      <PlaylistRemoveIcon />
    </IconButton>
  );
};

export default RemoveFromWatchlist;
