import React, { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";

const Login = () => {
  const { user, signInWithGoogle, logout } = useContext(AuthContext);

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" sx={{ padding: 2 }}>
      {user ? (
        <>
          <Avatar alt={user.displayName} src={user.photoURL} sx={{ width: 56, height: 56, mb: 2 }} />
          <Typography variant="h6" component="div">
            Welcome, {user.displayName}
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          sx={{ mt: 2 }}
        >
          Login with Google
        </Button>
      )}
    </Grid>
  );
};

export default Login;
