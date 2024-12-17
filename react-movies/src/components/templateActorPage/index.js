import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const TemplateActorPage = ({ actor, children }) => {
  return (
    <Container>
      <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
              alt={actor.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1">
              {actor.name}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              {actor.biography || "No biography available."}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} sx={{ padding: "20px" }}>
        {children}
      </Paper>
    </Container>
  );
};

export default TemplateActorPage;
