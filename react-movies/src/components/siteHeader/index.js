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

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, userData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuOptions = [
    { icon: <HomeIcon />, path: "/", tooltip: "Home" },
    { 
      icon: (
        <Badge badgeContent={userData?.favorites?.length || 0} color="error">
          <FavoriteIcon />
        </Badge>
      ), 
      path: "/movies/favorites", 
      tooltip: "Favorites" 
    },
    { icon: <UpcomingIcon />, path: "/movies/upcoming", tooltip: "Upcoming" },
    { icon: <TrendingUpIcon />, path: "/movies/trending", tooltip: "Trending" },
    { icon: <PlayCircleIcon />, path: "/movies/now_playing", tooltip: "Now Playing" },
    { 
      icon: (
        <Badge badgeContent={userData?.watchlist?.length || 0} color="error">
          <WatchLaterIcon />
        </Badge>
      ), 
      path: "/watchlist", 
      tooltip: "Watchlist" 
    },
  ];

  const handleMenuSelect = (pageURL) => {
    navigate(pageURL, { replace: true });
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </Typography>

          {user && (
            <Typography variant="h6" sx={{ mr: 2 }}>
              Welcome, {user.displayName || user.email}
            </Typography>
          )}

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
                <MenuItem onClick={user ? handleLogout : () => navigate("/login")}>
                  <Tooltip title={user ? "Logout" : "Login"} arrow>
                    {user ? <LogoutIcon /> : <LoginIcon />}
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

              {user && user.photoURL && (
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  sx={{ ml: 2, mr: 2 }}
                />
              )}  

              <Tooltip title={user ? "Logout" : "Login"} arrow>
                <IconButton color="inherit" onClick={user ? handleLogout : () => navigate("/login")}>
                  {user ? <LogoutIcon /> : <LoginIcon />}
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
