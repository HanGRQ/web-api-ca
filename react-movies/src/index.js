import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes, useLocation } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import FavoriteMoviesPage from "./pages/favoriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import SiteHeader from "./components/siteHeader";
import MoviesContextProvider from "./contexts/moviesContext";
import AuthContextProvider, { useAuth } from "./contexts/authContext";
import AddMovieReviewPage from "./pages/addMovieReviewPage";
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import TrendingMoviesPage from "./pages/trendingMoviesPage";
import NowPlayingMoviesPage from "./pages/nowPlayingMoviesPage";
import MovieRecommendationsPage from "./pages/movieRecommendationsPage";
import MovieCreditsPage from "./pages/movieCreditsPage";
import ActorDetails from "./pages/actorDetails";
import WatchlistPage from "./pages/watchlistPage";
import LoginPage from "./pages/loginPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false,
      retry: 2,  
      onError: (error) => {
        if (error.message === 'Unauthorized' || error.status === 401) {
          window.location.href = '/login';
        }
      }
    },
  },
});

const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// AppContent component
const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {location.pathname !== "/login" && <SiteHeader />}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><SiteHeader /><HomePage /></PrivateRoute>} />
        
        {/* Movies 相关路由 */}
        <Route path="/movies">
          <Route path="favorites" element={<PrivateRoute><FavoriteMoviesPage /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute><MoviePage /></PrivateRoute>} />
          <Route path=":id/recommendations" element={<PrivateRoute><MovieRecommendationsPage /></PrivateRoute>} />
          <Route path=":id/credits" element={<PrivateRoute><MovieCreditsPage /></PrivateRoute>} />
          <Route path="upcoming" element={<PrivateRoute><UpcomingMoviesPage /></PrivateRoute>} />
          <Route path="trending" element={<PrivateRoute><TrendingMoviesPage /></PrivateRoute>} />
          <Route path="now_playing" element={<PrivateRoute><NowPlayingMoviesPage /></PrivateRoute>} />
        </Route>

        {/* Reviews 相关路由 */}
        <Route path="/reviews">
          <Route path=":movieId/:reviewId" element={<PrivateRoute><MovieReviewPage /></PrivateRoute>} />
          <Route path="form" element={<PrivateRoute><AddMovieReviewPage /></PrivateRoute>} />
        </Route>

        {/* 其他路由 */}
        <Route path="/watchlist" element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
        <Route path="/actor/:id" element={<PrivateRoute><ActorDetails /></PrivateRoute>} />

        
        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContextProvider>
          <MoviesContextProvider>
            <AppContent />
          </MoviesContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const rootElement = createRoot(document.getElementById("root"));
rootElement.render(<App />);