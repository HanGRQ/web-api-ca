import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid2";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function MovieListPageTemplate({ movies, title, action }) {
    // 使用 Hooks
    const [nameFilter, setNameFilter] = useState("");
    const [genreFilter, setGenreFilter] = useState("0");
    const [languageFilter, setLanguageFilter] = useState("");
    const [starRateFilter, setStarRateFilter] = useState("");
    const [releaseYearFilter, setReleaseYearFilter] = useState("");
    const [sortField, setSortField] = useState(""); 
    const [sortOrder, setSortOrder] = useState("asc"); 
    const [page, setPage] = useState(1);
    const [filterVisible, setFilterVisible] = useState(false);

    const itemsPerPage = 8;
    const layoutConfig = { xs: 12, sm: 6, md: 4, lg: 3 };

    const genreId = Number(genreFilter);

    const uniqueMovies = movies.filter(
        (movie, index, self) => movie && self.findIndex((m) => m.id === movie.id) === index
      );      

    let displayedMovies = uniqueMovies
        .filter((m) => m && m.title) // Filter out undefined or invalid movies
        .filter((m) => m.title.toLowerCase().includes(nameFilter.toLowerCase()))
        .filter((m) => (genreId > 0 ? m.genre_ids.includes(genreId) : true))
        .filter((m) => (starRateFilter ? m.vote_average >= Number(starRateFilter) : true))
        .filter((m) => (releaseYearFilter ? m.release_date.startsWith(releaseYearFilter) : true))
        .filter((m) => (languageFilter ? m.original_language === languageFilter : true));


    // 排序逻辑
    if (sortField && sortOrder) {
        displayedMovies.sort((a, b) => {
            if (sortField === "title") {
                return sortOrder === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
            if (sortField === "releaseDate") {
                return sortOrder === "asc"
                    ? new Date(a.release_date) - new Date(b.release_date)
                    : new Date(b.release_date) - new Date(a.release_date);
            }
            if (sortField === "rating") {
                return sortOrder === "asc" ? a.vote_average - b.vote_average : b.vote_average - a.vote_average;
            }
            return 0;
        });
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMovies = displayedMovies.slice(startIndex, endIndex);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const handleChange = (type, value) => {
        switch (type) {
            case "name":
                setNameFilter(value);
                break;
            case "genre":
                setGenreFilter(value);
                break;
            case "language":
                setLanguageFilter(value);
                break;
            case "starRate":
                setStarRateFilter(value);
                break;
            case "releaseYear":
                setReleaseYearFilter(value);
                break;
            case "sortField":
                setSortField(value);
                break;
            case "sortOrder":
                setSortOrder(value);
                break;
            default:
                break;
        }
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Header title={title} />
            <Box textAlign="center" sx={{ mb: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setFilterVisible(!filterVisible)}
                    startIcon={filterVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                    {filterVisible ? "Hide Filters" : "Show Filters"}
                </Button>
            </Box>
            <Slide direction="down" in={filterVisible} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        backgroundColor: "#f5f5f5",
                        padding: "10px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    <FilterCard
                        onUserInput={handleChange}
                        titleFilter={nameFilter}
                        genreFilter={genreFilter}
                        languageFilter={languageFilter}
                        starRateFilter={starRateFilter}
                        releaseYearFilter={releaseYearFilter}
                        sortField={sortField}
                        sortOrder={sortOrder}
                    />
                </Box>
            </Slide>
            <Box sx={{ flex: 1, overflowY: "auto", height: "calc(100vh - 300px)", padding: "20px", boxSizing: "border-box" }}>
                <Grid container spacing={2}>
                    {paginatedMovies.map((movie) => (
                        <Grid item key={movie.id} {...layoutConfig}>
                            <MovieList action={action} movies={paginatedMovies} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Grid container justifyContent="center" sx={{ margin: "20px 0" }}>
                <Pagination
                    count={Math.ceil(displayedMovies.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    size="large"
                    variant="outlined"
                />
            </Grid>
        </Box>
    );
}

export default MovieListPageTemplate;
