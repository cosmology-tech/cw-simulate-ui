import ArticleIcon from "@mui/icons-material/Article";
import GitHubIcon from "@mui/icons-material/GitHub";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NotesIcon from "@mui/icons-material/Notes";
import { Grid, Typography } from "@mui/material";
import React, {
  HTMLAttributeAnchorTarget,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from "react";
import { To, useNavigate } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { DEFAULT_CHAIN, GREY_5, SENDER_ADDRESS } from "../../configs/variables";
import {
  SimulationJSON,
  useCreateNewSimulateApp, useSetupCwSimulateAppJson,
  useStoreCode,
} from "../../utils/simulationUtils";
import FileUpload from "../upload/FileUpload";
import T1Link from "../grid/T1Link";
import simulationMetadataState from "../../atoms/simulationMetadataState";
import { useAtom } from "jotai";
import FileUploadPaper from "../upload/FileUploadPaper";

export default function WelcomeScreen() {
  const [file, setFile] = useState<{ filename: string, fileContent: Buffer | JSON } | undefined>(undefined);
  const setNotification = useNotification();
  const [, setSimulationMetadata] = useAtom(simulationMetadataState);
  const navigate = useNavigate();
  const createSimulateApp = useCreateNewSimulateApp();
  const storeCode = useStoreCode();
  const setupSimulationJSON = useSetupCwSimulateAppJson();
  const onCreateNewEnvironment = useCallback(async () => {
    if (!file) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      return;
    }
    if (file.filename.endsWith(".wasm")) {
      createSimulateApp({chainId: DEFAULT_CHAIN, bech32Prefix: 'terra'});
      storeCode(SENDER_ADDRESS, file);
    } else if (file.filename.endsWith(".json")) {
      const json = file.fileContent as unknown as SimulationJSON;
      setupSimulationJSON(json);
    }
  }, [file, storeCode, setNotification, setSimulationMetadata]);

  const onAcceptFile = useCallback(async (filename: string, fileContent: Buffer | JSON) => {
    setFile({filename, fileContent});
  }, []);

  const onClearFile = useCallback(() => {
    setFile(undefined);
  }, []);

  useEffect(() => {
    if (file) {
      onCreateNewEnvironment().then(r => {
        navigate("/config");
      });
    }
  }, [file]);

  return (
    <Grid
      container
      item
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <Grid
        xs={12}
        md={10}
        lg={10}
        xl={8}
        container
        item
        justifyContent="center"
        sx={{border: `1px solid ${GREY_5}`, borderRadius: "10px", width: "60%"}}
        className="outerGrid"
      >
        <Grid
          item
          xs={12}
          sx={{ my: 4 }}
        >
          <Typography variant="h2" fontWeight={600} textAlign="center">
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
          <NavIcon to='https://github.com/Terran-One/cw-simulate-ui'>
            <GitHubIcon sx={{cursor: "pointer"}}/>
            <Typography>Github</Typography>
          </NavIcon>
        </WelcomeNavIcons>
        <Grid
          item
          xs={11}
          lg={7}
          md={8}
          sx={{ my: 4, width: "60%" }}
        >
          <FileUploadPaper sx={{ minHeight: 280 }}>
            <FileUpload onAccept={onAcceptFile} onClear={onClearFile}/>
          </FileUploadPaper>
        </Grid>
      </Grid>
    </Grid>
  );
};

function WelcomeNavIcons({children}: PropsWithChildren) {
  return (
    <Grid
      item
      container
      direction="row"
      flexWrap="wrap"
      justifyContent="space-between"
      xs={11}
      lg={6}
      md={8}
      sx={{ my: 4 }}
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
        direction='column'
        alignItems='center'
        sx={{
          mx: 1,
        }}
      >
        {children}
      </Grid>
    </T1Link>
  );
};
