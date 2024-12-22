import React, { useState, useEffect } from "react";
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
import { getMovies } from "../../api/tmdb-api";

function MovieListPageTemplate({ title, action,movies = [] }) {
    const [nameFilter, setNameFilter] = useState("");
    const [genreFilter, setGenreFilter] = useState("0");
    const [languageFilter, setLanguageFilter] = useState("");
    const [starRateFilter, setStarRateFilter] = useState("");
    const [releaseYearFilter, setReleaseYearFilter] = useState("");
    const [sortField, setSortField] = useState(""); 
    const [sortOrder, setSortOrder] = useState("asc"); 
    const [filterVisible, setFilterVisible] = useState(false);

    // 分页相关状态
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [moviesList, setMoviesList] = useState([]);

    const isListPage = title.toLowerCase().includes('favorite') || 
                      title.toLowerCase().includes('watchlist');

    // 加载电影数据
    useEffect(() => {
        if (!isListPage) {
            // 如果不是收藏页面，从API获取数据
            const loadMovies = async () => {
                try {
                    const data = await getMovies(currentPage);
                    if (data) {
                        setMoviesList(data.results || []);
                        setTotalPages(data.total_pages || 0);
                    }
                } catch (error) {
                    console.error("Failed to load movies:", error);
                    setMoviesList([]);
                }
            };
            loadMovies();
        } else {
            // 如果是收藏页面，使用传入的movies
            setMoviesList(movies);
            // 计算总页数（假设每页显示8个）
            setTotalPages(Math.ceil(movies.length / 8));
        }
    }, [currentPage, isListPage, movies]);

    const handlePageChange = (event, value) => {
        console.log("Changing to page:", value); // 调试日志
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const genreId = Number(genreFilter);

    const getCurrentPageMovies = (allMovies) => {
        if (isListPage) {
            const startIndex = (currentPage - 1) * 8;
            const endIndex = startIndex + 8;
            return allMovies.slice(startIndex, endIndex);
        }
        return allMovies;
    };

    // 筛选逻辑
    let displayedMovies = getCurrentPageMovies(moviesList)
        .filter((m) => m && m.title)
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
                return sortOrder === "asc" 
                    ? a.vote_average - b.vote_average 
                    : b.vote_average - a.vote_average;
            }
            return 0;
        });
    }

    const handleChange = (type, value) => {
        switch (type) {
            case "name":
                setNameFilter(value);
                setCurrentPage(1); // 重置到第一页
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
            <Grid item xs={12}>
                <Header title={title} />
            </Grid>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ flex: "1 1 500px", padding: "20px" }}
            >
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setFilterVisible(!filterVisible)}
                        startIcon={filterVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                        {filterVisible ? "Hide Filters" : "Show Filters"}
                    </Button>
                </Grid>
                <Slide direction="down" in={filterVisible} mountOnEnter unmountOnExit>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                        sx={{ padding: "20px" }}
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
                    </Grid>
                </Slide>
                <Grid item xs={12}>
                    <MovieList action={action} movies={displayedMovies} />
                </Grid>

                {/* 分页控件 */}
                {totalPages > 1 && (
                    <Grid item>
                        <Box sx={{ mt: 4, mb: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
}

export default MovieListPageTemplate;

