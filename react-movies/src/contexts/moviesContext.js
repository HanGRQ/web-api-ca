// contexts/moviesContext.js
import React, { useState, createContext, useEffect, useContext } from "react";
import { AuthContext } from "./authContext";

export const MoviesContext = createContext(null);

const MoviesContextProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [myReviews, setMyReviews] = useState({});
  const { token } = useContext(AuthContext);

  const loadUserData = async () => {
    try {
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/users/me', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load user data: ' + response.status);
      }

      const data = await response.json();
      if (data.user) {
        setFavorites(data.user.favorites || []);
        setWatchlist(data.user.watchlist || []);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
  
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to load user data: ' + response.status);
        }
  
        const data = await response.json();
        if (data.user) {
          setFavorites(data.user.favorites || []);
          setWatchlist(data.user.watchlist || []);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchData();
  }, [token]); 

  const addToFavorites = async (movie) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/favorites/${movie.id}`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (movie) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/favorites/${movie.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const addToWatchlist = async (movie) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/watchlist/${movie.id}`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add to watchlist');
      }

      const data = await response.json();
      setWatchlist(data.watchlist);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (movie) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/watchlist/${movie.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from watchlist');
      }

      const data = await response.json();
      setWatchlist(data.watchlist);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const addReview = (movie, review) => {
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        watchlist,
        addToFavorites,
        removeFromFavorites,
        addToWatchlist,
        removeFromWatchlist,
        addReview,
        loadUserData 
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;