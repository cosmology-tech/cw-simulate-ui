import { Button, Grid, Paper, styled, Typography } from "@mui/material";
import React, { HTMLAttributeAnchorTarget, PropsWithChildren } from "react";
import FileUpload from "../FileUpload";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ArticleIcon from "@mui/icons-material/Article";
import NotesIcon from "@mui/icons-material/Notes";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useCreateChainForSimulation } from "../../utils/setupSimulation";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import T1Link from "../T1Link";
import { To } from "react-router-dom";
import filteredChainsFromSimulationState from "../../selectors/filteredChainsFromSimulationState";

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
  const currentChains = useRecoilValue(filteredChainsFromSimulationState);
  const createChainForSimulation = useCreateChainForSimulation();
  const onCreateNewEnvironment = () => {
    currentChains.forEach((chain: any) => {
      createChainForSimulation({
        chainId: chain.chainId,
        bech32Prefix: chain.bech32Prefix
      });
    });
  };

  return (
    <Grid
      xs={12}
      md={12}
      lg={12}
      xl={12}
      container
      item
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
        item
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
        <WelcomeNavIcons>
          <NavIcon to='/tutorials'>
            <LibraryBooksIcon sx={{cursor: "pointer"}}/>
            <Typography>Tutorials</Typography>
          </NavIcon>
          <NavIcon to='/documentation'>
            <ArticleIcon sx={{cursor: "pointer"}}/>
            <Typography>Documentation</Typography>
          </NavIcon>
          <NavIcon to='/examples'>
            <NotesIcon sx={{cursor: "pointer"}}/>
            <Typography>Examples</Typography>
          </NavIcon>
          <NavIcon to='https://github.com/Terran-One/cw-debug-ui'>
            <GitHubIcon sx={{cursor: "pointer"}}/>
            <Typography>Github</Typography>
          </NavIcon>
        </WelcomeNavIcons>
        <Grid
          item
          xs={11}
          lg={7}
          md={8}
          sx={{marginTop: 4, marginBottom: 4, width: "60%"}}
        >
          <Item sx={{border: "1px solid #eae5e5"}}>
            <FileUpload fileTypes={["application/wasm", "application/json"]}/>
          </Item>
        </Grid>
        <Grid
          item
          xs={8}
          md={10}
          lg={6}
          sx={{display: "flex", justifyContent: "center", marginBottom: 4}}
        >
          <T1Link to={"/chains"} sx={{textDecoration: "none"}} disabled={!isFileUploaded}>
            <Button
              variant="contained"
              sx={{borderRadius: "10px"}}
              onClick={onCreateNewEnvironment}
              disabled={!isFileUploaded}
            >
              New Simulation Environment
            </Button>
          </T1Link>
        </Grid>
      </Grid>
    </Grid>
  );
};

function WelcomeNavIcons({children}: PropsWithChildren) {
  return (
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
      {children}
    </Grid>
  )
}

interface INavIconProps extends PropsWithChildren {
  to: To;
  title?: string;
  target?: HTMLAttributeAnchorTarget;
}

function NavIcon(props: INavIconProps) {
  const {
    children,
    ...rest
  } = props;

  return (
    <T1Link {...rest}>
      <Grid
        container
        component='div'
        direction='column'
        sx={{
          alignItems: 'center',
          display: 'flex',
          marginLeft: 1,
          marginRight: 1,
        }}
      >
        {children}
      </Grid>
    </T1Link>
  );
};
