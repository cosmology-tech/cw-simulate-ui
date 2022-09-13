import { Button, Grid, Paper, styled, Typography } from "@mui/material";
import React from "react";
import FileUpload from "../FileUpload";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ArticleIcon from "@mui/icons-material/Article";
import NotesIcon from "@mui/icons-material/Notes";
import GitHubIcon from "@mui/icons-material/GitHub";
import { createSimulateEnv } from "../../utils/setupSimulation";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { fileUploadedState } from "../../atoms/fileUploadedState";

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface IProps {
  setWasmBuffers: (fileBuffer: ArrayBuffer[]) => void;
  wasmBuffers: ArrayBuffer[];
}

export const WelcomeScreen = ({setWasmBuffers, wasmBuffers}: IProps) => {
  const isFileUploaded = useRecoilValue(fileUploadedState);
  const onCreateNewEnvironment = () => {
    window.CWEnv = createSimulateEnv();
  };

  return (
    <Grid
      xs={12}
      md={12}
      lg={12}
      xl={12}
      container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        xs={12}
        md={10}
        lg={10}
        xl={8}
        container
        justifyContent="center"
        sx={{border: "1px solid #eae5e5", borderRadius: "10px", width: "60%"}}
        className="outerGrid"
      >
        <Grid
          item
          xs={12}
          sx={{marginTop: 4, marginBottom: 4, textAlign: "center"}}
        >
          <Typography variant="h2" sx={{fontWeight: 600}}>
            CosmWasm Simulator
          </Typography>
        </Grid>
        <Grid
          item
          xs={11}
          lg={6}
          md={8}
          sx={{
            marginTop: 4,
            marginBottom: 4,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Grid
            component="div"
            direction="column"
            sx={{
              alignItems: "center",
              display: "flex",
              marginLeft: 1,
              marginRight: 1,
            }}
          >
            <LibraryBooksIcon sx={{cursor: "pointer"}}/>
            <Typography>Tutorials</Typography>
          </Grid>
          <Grid
            component="div"
            direction="column"
            sx={{
              alignItems: "center",
              display: "flex",
              marginLeft: 1,
              marginRight: 1,
            }}
          >
            <ArticleIcon sx={{cursor: "pointer"}}/>
            <Typography>Documentation</Typography>
          </Grid>
          <Grid
            component="div"
            direction="column"
            sx={{
              alignItems: "center",
              display: "flex",
              marginLeft: 1,
              marginRight: 1,
            }}
          >
            <NotesIcon sx={{cursor: "pointer"}}/>
            <Typography>Examples</Typography>
          </Grid>
          <Grid
            component="div"
            direction="column"
            sx={{
              alignItems: "center",
              display: "flex",
              marginLeft: 1,
              marginRight: 1,
            }}
          >
            <GitHubIcon sx={{cursor: "pointer"}}/>
            <Typography>Github</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          xs={11}
          lg={7}
          md={8}
          sx={{marginTop: 4, marginBottom: 4, width: "60%"}}
        >
          <Item sx={{border: "1px solid #eae5e5"}}>
            <FileUpload
              setWasmBuffers={setWasmBuffers}
              wasmBuffers={wasmBuffers}
            />
          </Item>
        </Grid>
        <Grid
          item
          xs={8}
          md={10}
          lg={6}
          sx={{display: "flex", justifyContent: "center", marginBottom: 4}}
        >
          <Link to={"/chains"} style={{textDecoration: "none"}}>
            <Button
              variant="contained"
              sx={{borderRadius: "10px"}}
              onClick={onCreateNewEnvironment}
              disabled={!isFileUploaded}
            >
              New Simulation Environment
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
