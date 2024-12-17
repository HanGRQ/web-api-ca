import React, { useState, createContext } from "react";

export const MoviesContext = createContext(null);

const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [myReviews, setMyReviews] = useState({});

  // 添加到收藏夹
  const addToFavorites = (movie) => {
    if (!favorites.includes(movie.id)) {
      setFavorites([...favorites, movie.id]);
    }
  };

  // 从收藏夹移除
  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((id) => id !== movie.id));
  };

  // 添加到 Watchlist
  const addToWatchlist = (movie) => {
    if (!watchlist.includes(movie.id)) {
      setWatchlist([...watchlist, movie.id]);
    }
  };

  // 从 Watchlist 移除
  const removeFromWatchlist = (movie) => {
    setWatchlist(watchlist.filter((id) => id !== movie.id));
  };

  // 添加影评
  const addReview = (movie, review) => {
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        watchlist,
        myReviews,
        addToFavorites,
        removeFromFavorites,
        addToWatchlist,
        removeFromWatchlist,
        addReview,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
