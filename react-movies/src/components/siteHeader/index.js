// components/siteHeader/index.js
import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import UpcomingIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthContext } from "../../contexts/authContext";
import { MoviesContext } from "../../contexts/moviesContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    padding: '0 4px',
  },
}));

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { favorites, watchlist } = useContext(MoviesContext);
  const navigate = useNavigate();

  const publicMenuOptions = [
    { icon: <HomeIcon />, path: "/", tooltip: "Home" }
  ];

  const protectedMenuOptions = [
    { 
      icon: (
        <StyledBadge badgeContent={favorites?.length || 0} color="error" showZero>
          <FavoriteIcon />
        </StyledBadge>
      ), 
      path: "/movies/favorites", 
      tooltip: `Favorites (${favorites?.length || 0})` 
    },
    { icon: <UpcomingIcon />, path: "/movies/upcoming", tooltip: "Upcoming" },
    { icon: <TrendingUpIcon />, path: "/movies/trending", tooltip: "Trending" },
    { icon: <PlayCircleIcon />, path: "/movies/now_playing", tooltip: "Now Playing" },
    { 
      icon: (
        <StyledBadge badgeContent={watchlist?.length || 0} color="error" showZero>
          <WatchLaterIcon />
        </StyledBadge>
      ), 
      path: "/watchlist", 
      tooltip: `Watchlist (${watchlist?.length || 0})`
    },
  ];

  const menuOptions = isAuthenticated 
    ? [...publicMenuOptions, ...protectedMenuOptions]
    : publicMenuOptions;

  const handleMenuSelect = (pageURL) => {
    navigate(pageURL);
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await logout();
      navigate("/");
    }
  };

  const welcomeMessage = isAuthenticated
    ? `Welcome, ${user?.email || 'User'}`
    : 'Welcome, my friends!';

  return (
    <>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </Typography>

          <Typography variant="h6" sx={{ mr: 2 }}>
            {welcomeMessage}
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                {menuOptions.map((opt, index) => (
                  <MenuItem key={index} onClick={() => handleMenuSelect(opt.path)}>
                    <Tooltip title={opt.tooltip} arrow>
                      {opt.icon}
                    </Tooltip>
                  </MenuItem>
                ))}
                <MenuItem onClick={isAuthenticated ? handleLogout : () => navigate("/login")}>
                  <Tooltip title={isAuthenticated ? "Logout" : "Login"} arrow>
                    {isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
                  </Tooltip>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {menuOptions.map((opt, index) => (
                <Tooltip key={index} title={opt.tooltip} arrow>
                  <IconButton color="inherit" onClick={() => handleMenuSelect(opt.path)}>
                    {opt.icon}
                  </IconButton>
                </Tooltip>
              ))}

              {isAuthenticated && user?.photoURL && (
                <Avatar
                  src={user.photoURL}
                  alt={user.email}
                  sx={{ ml: 2, mr: 2 }}
                />
              )}

              <Tooltip title={isAuthenticated ? "Logout" : "Login"} arrow>
                <IconButton 
                  color="inherit" 
                  onClick={isAuthenticated ? handleLogout : () => navigate("/login")}
                >
                  {isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;