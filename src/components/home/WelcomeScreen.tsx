import ArticleIcon from "@mui/icons-material/Article";
import GitHubIcon from "@mui/icons-material/GitHub";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NotesIcon from "@mui/icons-material/Notes";
import { Grid, Paper, styled, Typography } from "@mui/material";
import React, {
  HTMLAttributeAnchorTarget,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from "react";
import { To, useNavigate } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { DEFAULT_CHAIN } from "../../configs/variables";
import {
  SimulationJSON,
  useCreateChainForSimulation,
  useSetupSimulationJSON,
  useStoreCode
} from "../../utils/simulationUtils";
import FileUpload from "../upload/FileUpload";
import T1Link from "../grid/T1Link";
import cwSimulateEnvState from "../../atoms/cwSimulateEnvState";
import simulationMetadataState from "../../atoms/simulationMetadataState";
import { useAtom } from "jotai";
import Item from "../upload/item";

export const WelcomeScreen = () => {
  const [file, setFile] = useState<{ filename: string, fileContent: Buffer | JSON } | undefined>(undefined);
  const setNotification = useNotification();
  const createChainForSimulation = useCreateChainForSimulation();
  const storeCode = useStoreCode();
  const [, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [, setSimulateEnv] = useAtom(cwSimulateEnvState);
  const setupSimulation = useSetupSimulationJSON();
  const navigate = useNavigate();
  const onCreateNewEnvironment = useCallback(async () => {
    if (!file) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      return;
    }
    if (file.filename.endsWith(".wasm")) {
      createChainForSimulation({
        chainId: DEFAULT_CHAIN,
        bech32Prefix: 'terra',
      });
      storeCode(DEFAULT_CHAIN, file.filename, file.fileContent as Buffer);
    } else if (file.filename.endsWith(".json")) {
      const json = file.fileContent as unknown as SimulationJSON;
      await setupSimulation(json);
    }
  }, [file, createChainForSimulation, storeCode, setNotification, setSimulationMetadata, setSimulateEnv]);

  const onAcceptFile = useCallback(async (filename: string, fileContent: Buffer | JSON) => {
    setFile({filename, fileContent});
  }, []);

  const onClearFile = useCallback(() => {
    setFile(undefined);
  }, []);

  useEffect(() => {
    if (file) {
      onCreateNewEnvironment().then(r => {
        navigate("/chains");
      });
    }
  }, [file]);

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
          <Item sx={{border: "1px solid #eae5e5", padding: 0}}>
            <FileUpload onAccept={onAcceptFile} onClear={onClearFile}/>
          </Item>
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
