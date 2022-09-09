import { Box, Button, Grid, Paper, styled, Typography } from "@mui/material";
import React from "react";
import FileUpload from "./FileUpload";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ArticleIcon from "@mui/icons-material/Article";
import NotesIcon from "@mui/icons-material/Notes";
import GitHubIcon from "@mui/icons-material/GitHub";
import { createSimulateEnv } from "../utils/setupSimulation";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface IProps {
  setWasmBuffer: (fileBuffer: ArrayBuffer | null) => void;
}

export const WelcomeScreen = ({ setWasmBuffer }: IProps) => {
  const onCreateNewEnvironment = () => {
    window.CWEnv = createSimulateEnv();
  }

  return (
    <Grid
      sx={{
        height: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        sx={{ border: "1px solid #eae5e5", borderRadius: "10px", width: "60%" }}
        className="outerGrid"
      >
        <Grid item xs={12} sx={{ marginTop: 6, marginBottom: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: 600 }}>
            CosmWasm Simulator
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            marginTop: 4,
            marginBottom: 4,
            display: "flex",
            flexDirection: "row",
            width: "50%",
            justifyContent: "space-between",
          }}
        >
          <Grid
            component="div"
            direction="column"
            sx={{ alignItems: "center", display: "flex" }}
          >
            <LibraryBooksIcon sx={{ cursor: "pointer" }} />
            <Typography>Tutorials</Typography>
          </Grid>
          <Grid
            component="div"
            direction="column"
            sx={{ alignItems: "center", display: "flex" }}
          >
            <ArticleIcon sx={{ cursor: "pointer" }} />
            <Typography>Documentation</Typography>
          </Grid>
          <Grid
            component="div"
            direction="column"
            sx={{ alignItems: "center", display: "flex" }}
          >
            <NotesIcon sx={{ cursor: "pointer" }} />
            <Typography>Examples</Typography>
          </Grid>
          <Grid
            component="div"
            direction="column"
            sx={{ alignItems: "center", display: "flex" }}
          >
            <GitHubIcon sx={{ cursor: "pointer" }} />
            <Typography>Github</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4, width: "60%" }}>
          <Item sx={{ border: "1px solid #eae5e5" }}>
            <FileUpload setWasmBuffer={setWasmBuffer} />
          </Item>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 1 }}>
          <Button variant="contained" sx={{ borderRadius: "10px" }} onClick={onCreateNewEnvironment}>
            New Simulation Environment
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{ borderRadius: "10px", marginTop: 1, marginBottom: 6 }}
        >
          <img src="/T1_Logo.svg" height="100px" />
        </Grid>
      </Grid>
    </Grid>
  );
};
