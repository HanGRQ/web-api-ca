import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getGenres } from "../../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../spinner";
import Box from "@mui/material/Box";

const formControl = {
  margin: 1,
  minWidth: "90%",
  backgroundColor: "rgb(255, 255, 255)",
};

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Chinese", value: "zh" },
  { label: "Tagalog", value: "tl" },
];

const starRatingOptions = [
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
  { label: "5+", value: 5 },
  { label: "6+", value: 6 },
  { label: "7+", value: 7 },
  { label: "8+", value: 8 },
  { label: "9+", value: 9 },
];

const releaseYearOptions = [
  { label: "2021 Before", value: "2021 Before" },
  { label: "2022", value: "2022" },
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
];

export default function FilterMoviesCard(props) {
  const { data, error, isLoading, isError } = useQuery("genres", getGenres);

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const genres = data.genres;
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  const handleChange = (e, type, value) => {
    e.preventDefault();
    props.onUserInput(type, value);
  };

  const handleTextChange = (e) => handleChange(e, "name", e.target.value);
  const handleGenreChange = (e) => handleChange(e, "genre", e.target.value);
  const handleLanguageChange = (e) => handleChange(e, "language", e.target.value);
  const handleStarRateChange = (e) => handleChange(e, "starRate", e.target.value);
  const handleReleaseYearChange = (e) => handleChange(e, "releaseYear", e.target.value);
  // 新增排序字段和排序顺序的处理函数
  const handleSortFieldChange = (e) => handleChange(e, "sortField", e.target.value);
  const handleSortOrderChange = (e) => handleChange(e, "sortOrder", e.target.value);

  return (
    <Card sx={{ backgroundColor: "rgb(204, 204, 0)" }} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter the movies
        </Typography>

        {/* 标题筛选 */}
        <TextField
          sx={{ ...formControl }}
          id="filled-search"
          label="Search field"
          type="search"
          variant="filled"
          value={props.titleFilter}
          onChange={handleTextChange}
        />

        {/* 类型筛选 */}
        <FormControl sx={{ ...formControl }}>
          <InputLabel id="genre-label">Genre</InputLabel>
          <Select
            labelId="genre-label"
            id="genre-select"
            value={props.genreFilter}
            onChange={handleGenreChange}
            label="Genre"
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 语言筛选 */}
        <FormControl sx={{ ...formControl }}>
          <InputLabel id="language-label" shrink>Language</InputLabel>
          <Select
            labelId="language-label"
            id="language-select"
            value={props.languageFilter || ""}
            onChange={handleLanguageChange}
            displayEmpty
            renderValue={(selected) => {
              return selected === "" ? "All" : languageOptions.find((lang) => lang.value === selected)?.label;
            }}
          >
            <MenuItem value="">All</MenuItem>
            {languageOptions.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 评分筛选 */}
        <FormControl sx={{ ...formControl }}>
          <InputLabel id="starRate-label" shrink>Star Rating</InputLabel>
          <Select
            labelId="starRate-label"
            id="starRate-select"
            value={props.starRateFilter || ""}
            onChange={handleStarRateChange}
            displayEmpty
            renderValue={(selected) => {
              return selected === "" ? "All" : starRatingOptions.find((option) => option.value === selected)?.label;
            }}
          >
            <MenuItem value="">All</MenuItem>
            {starRatingOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 发布年份筛选 */}
        <FormControl sx={{ ...formControl }}>
          <InputLabel id="releaseYear-label" shrink>Release Year</InputLabel>
          <Select
            labelId="releaseYear-label"
            id="releaseYear-select"
            value={props.releaseYearFilter || ""}
            onChange={handleReleaseYearChange}
            displayEmpty
            renderValue={(selected) => {
              return selected === "" ? "All" : releaseYearOptions.find((option) => option.value === selected)?.label;
            }}
          >
            <MenuItem value="">All</MenuItem>
            {releaseYearOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      {/* 排序区域 */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", marginTop: 2 }}>
        {/* 排序字段 */}
        <FormControl sx={{ width: "45%", backgroundColor: "white", borderRadius: 1 }}>
          <InputLabel id="sortField-label">Sort By</InputLabel>
          <Select
            labelId="sortField-label"
            id="sortField-select"
            value={props.sortField || ""}
            onChange={handleSortFieldChange}
            displayEmpty
            renderValue={(selected) => {
              return selected === "All" ? "All" : selected;
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="releaseDate">Release Date</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </Select>
        </FormControl>

        {/* 排序顺序 */}
        <FormControl sx={{ width: "45%", backgroundColor: "white", borderRadius: 1 }}>
          <InputLabel id="sortOrder-label">Order</InputLabel>
          <Select
            labelId="sortOrder-label"
            id="sortOrder-select"
            value={props.sortOrder || ""}
            onChange={handleSortOrderChange}
            displayEmpty
            renderValue={(selected) => {
              return selected === "All" ? "All" : selected;
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>        
      </CardContent>
    </Card>
  );
}
