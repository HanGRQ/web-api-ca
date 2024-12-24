import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes, useLocation } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Import components and pages...
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
    },
  },
});

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// AppContent component
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <SiteHeader />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes */}
        <Route path="/movies">
          <Route path="favorites" element={<PrivateRoute><FavoriteMoviesPage /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute><MoviePage /></PrivateRoute>} />
          <Route path=":id/recommendations" element={<PrivateRoute><MovieRecommendationsPage /></PrivateRoute>} />
          <Route path=":id/credits" element={<PrivateRoute><MovieCreditsPage /></PrivateRoute>} />
          <Route path="upcoming" element={<PrivateRoute><UpcomingMoviesPage /></PrivateRoute>} />
          <Route path="trending" element={<PrivateRoute><TrendingMoviesPage /></PrivateRoute>} />
          <Route path="now_playing" element={<PrivateRoute><NowPlayingMoviesPage /></PrivateRoute>} />
        </Route>

        <Route path="/reviews">
          <Route path=":movieId/:reviewId" element={<PrivateRoute><MovieReviewPage /></PrivateRoute>} />
          <Route path="form" element={<PrivateRoute><AddMovieReviewPage /></PrivateRoute>} />
        </Route>

        <Route path="/watchlist" element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
        <Route path="/actor/:id" element={<PrivateRoute><ActorDetails /></PrivateRoute>} />

        {/* 404 Redirect */}
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