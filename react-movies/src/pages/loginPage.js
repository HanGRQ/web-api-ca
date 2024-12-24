import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import backgroundImage from "../images/Background.jpg";
import welcomeImage from "../images/welcome.png"; 
import Alert from "@mui/material/Alert";

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
  fontSize: "2.5rem",
  fontFamily: "Brush Script MT, cursive",
});

const LoginContainer = styled(Box)({
  border: "2px solid black",
  borderRadius: "15px",
  padding: "20px",
  maxWidth: "400px",
  width: "100%",
  backgroundColor: "white",
  boxSizing: "border-box",
});

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

const WelcomeImage = styled("img")(({ theme }) => ({
  position: "absolute",
  top: "10%",
  left: "2%",
  maxWidth: "40vw", 
  maxHeight: "40vh", 
  transform: "rotate(-35deg)",
  zIndex: 10,
  [theme.breakpoints.down("md")]: {
    maxWidth: "50vw", 
    maxHeight: "30vh",
  },
  [theme.breakpoints.down("sm")]: {
    top: "5%", 
    left: "2%",
    maxWidth: "60vw", 
    maxHeight: "20vh", 
  },
}));

const LoginPage = () => {
  const { user, error, signInWithGoogle, registerWithEmail, signInWithEmail, clearError } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const validateInput = () => {
    if (!email || !password) {
      setValidationError("Email and password are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateInput()) return;

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setValidationError(err.message);
    }
  };

  return (
    <>
      <BackgroundContainer />

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

          {(error || validationError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || validationError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              error={!!validationError}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              error={!!validationError}
              helperText={isRegister ? "Password must be at least 8 characters" : ""}
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
            onClick={() => {
              setIsRegister(!isRegister);
              clearError();
              setValidationError("");
            }}
            sx={{ mb: 2 }}
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </Button>

          <Divider sx={{ width: "100%", mb: 2 }}>OR</Divider>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            fullWidth
          >
            Continue with Google
          </Button>
        </LoginContainer>
      </Grid>
    </>
  );
};

export default LoginPage;