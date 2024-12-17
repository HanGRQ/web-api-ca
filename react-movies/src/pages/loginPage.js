import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import backgroundImage from "../images/Background.jpg";
import welcomeImage from "../images/welcome.png"; // 引入 welcome.png

// 自定义样式，用于加粗 "Login" 标题
const StyledTypography = styled(Typography)({
  fontWeight: "bold",
  fontSize: "2.5rem",
  fontFamily: "Brush Script MT, cursive",
});

// 为登录内容创建边框样式的 Box 组件
const LoginContainer = styled(Box)({
  border: "2px solid black",
  borderRadius: "15px",
  padding: "20px",
  maxWidth: "400px",
  width: "100%",
  backgroundColor: "white",
  boxSizing: "border-box",
});

// 背景样式
const BackgroundContainer = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: -1,
});

// 左上角图片样式
const WelcomeImage = styled("img")(({ theme }) => ({
  position: "absolute",
  top: "10%",
  left: "2%",
  maxWidth: "40vw", // 最大宽度设为屏幕宽度的 40%
  maxHeight: "40vh", // 最大高度设为屏幕高度的 40%
  transform: "rotate(-35deg)",
  zIndex: 10,
  [theme.breakpoints.down("md")]: {
    maxWidth: "50vw", // 中等屏幕时调整宽度为 50%
    maxHeight: "30vh", // 高度调整为 30%
  },
  [theme.breakpoints.down("sm")]: {
    top: "5%", // 小屏幕时调整位置
    left: "2%",
    maxWidth: "60vw", // 小屏幕时宽度调整为 60%
    maxHeight: "20vh", // 高度调整为 20%
  },
}));

const LoginPage = () => {
  const { user, signInWithGoogle, registerWithEmail, signInWithEmail, logout } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    await registerWithEmail(email, password);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    await signInWithEmail(email, password);
  };

  return (
    <>
      {/* 背景容器 */}
      <BackgroundContainer />

      {/* 左上角图片 */}
      <WelcomeImage src={welcomeImage} alt="Welcome" />

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        sx={{ minHeight: "100vh" }}
      >
        <LoginContainer>
          <StyledTypography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </StyledTypography>
          {user ? (
            <>
              <Avatar alt={user.displayName} src={user.photoURL} sx={{ width: 56, height: 56, mb: 2, mx: "auto" }} />
              <Typography variant="h6" component="div" align="center">
                Welcome, {user.displayName || user.email}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ mt: 2 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <form onSubmit={isRegister ? handleEmailRegister : handleEmailLogin}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  {isRegister ? "Register" : "Login"}
                </Button>
              </form>

              <Button
                variant="text"
                color="primary"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
              </Button>

              <Divider sx={{ width: "100%", mt: 1, mb: 1 }} />

              <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={signInWithGoogle}
                sx={{ mb: 1 }}
                fullWidth
              >
                Login with Google
              </Button>
            </>
          )}
        </LoginContainer>
      </Grid>
    </>
  );
};

export default LoginPage;
