import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";

function MovieListPageTemplate({
    title,
    action,
    movies = [], 
    totalPages = 1, 
    onPageChange, 
}) {
    const [nameFilter, setNameFilter] = useState("");
    const [genreFilter, setGenreFilter] = useState("0");
    const [languageFilter, setLanguageFilter] = useState("");
    const [starRateFilter, setStarRateFilter] = useState("");
    const [releaseYearFilter, setReleaseYearFilter] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterVisible, setFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const genreId = Number(genreFilter);

    const handlePageChange = (page) => {
        console.log("Page Changed To:", page); // 调试日志
        setCurrentPage(page); // 更新本地分页状态
        onPageChange(page); // 通知父组件加载新的数据
    };

    let displayedMovies = movies
        .filter((m) => m && m.title)
        .filter((m) => m.title.toLowerCase().includes(nameFilter.toLowerCase()))
        .filter((m) => (genreId > 0 ? m.genre_ids.includes(genreId) : true))
        .filter((m) => (starRateFilter ? m.vote_average >= Number(starRateFilter) : true))
        .filter((m) => (releaseYearFilter ? m.release_date.startsWith(releaseYearFilter) : true))
        .filter((m) => (languageFilter ? m.original_language === languageFilter : true));

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
                return sortOrder === "asc"
                    ? a.vote_average - b.vote_average
                    : b.vote_average - a.vote_average;
            }
            return 0;
        });
    }

    const handleChange = (type, value) => {
        console.log("Filter Changed:", { type, value }); // 调试日志
        switch (type) {
            case "name":
                setNameFilter(value);
                setCurrentPage(1);
                break;
            case "genre":
                setGenreFilter(value);
                setCurrentPage(1);
                break;
            case "language":
                setLanguageFilter(value);
                setCurrentPage(1);
                break;
            case "starRate":
                setStarRateFilter(value);
                setCurrentPage(1);
                break;
            case "releaseYear":
                setReleaseYearFilter(value);
                setCurrentPage(1);
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
        <Grid container direction="column">
            <Grid item={true.toString()} xs={12}>
                <Header title={title} />
            </Grid>
            <Grid container direction="column" alignItems="center" sx={{ padding: "20px" }}>
                <Grid item={true.toString()}>
                    <Button
                        variant="contained"
                        onClick={() => setFilterVisible(!filterVisible)}
                        startIcon={filterVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                        {filterVisible ? "Hide Filters" : "Show Filters"}
                    </Button>
                </Grid>
                <Slide direction="down" in={filterVisible} mountOnEnter unmountOnExit>
                    <Grid item={true.toString()} xs={12} sx={{ padding: "20px" }}>
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
                    </Grid>
                </Slide>
                <Grid item={true.toString()} xs={12}>
                    <MovieList action={action} movies={displayedMovies} />
                </Grid>

                {totalPages > 1 && (
                    <Grid item={true.toString()}>
                        <Box sx={{ mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(event, value) => handlePageChange(value)} 
                                color="primary"
                                size="large"
                            />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
}

export default MovieListPageTemplate;
