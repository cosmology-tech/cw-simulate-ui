import useTheme from "@mui/material/styles/useTheme";
import { Box, Grid, Stack, SvgIcon, Typography } from "@mui/material";
import React, {
  HTMLAttributeAnchorTarget,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from "react";
import { To, useNavigate } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { DEFAULT_CHAIN, SENDER_ADDRESS } from "../../configs/constants";
import {
  SimulationJSON,
  useCreateNewSimulateApp,
  useSetupCwSimulateAppJson,
  useStoreCode,
} from "../../utils/simulationUtils";
import FileUpload from "../upload/FileUpload";
import T1Link from "../grid/T1Link";
import simulationMetadataState from "../../atoms/simulationMetadataState";
import { useAtom } from "jotai";
import FileUploadPaper from "../upload/FileUploadPaper";
import { ReactComponent as LunaIcon } from "@public/luna.svg";
import { ReactComponent as InjectiveIcon } from "@public/injective.svg";
import { ReactComponent as OsmosisIcon } from "@public/osmosis.svg";
import JunoSvgIcon from "./JunoIcon";

export default function WelcomeScreen() {
  const [file, setFile] = useState<{ filename: string, fileContent: Buffer | JSON } | undefined>(undefined);
  const setNotification = useNotification();
  const [, setSimulationMetadata] = useAtom(simulationMetadataState);
  const navigate = useNavigate();
  const createSimulateApp = useCreateNewSimulateApp();
  const storeCode = useStoreCode();
  const setupSimulationJSON = useSetupCwSimulateAppJson();

  const theme = useTheme();

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
        navigate("/accounts");
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
        sx={{border: `1px solid ${theme.palette.line}`, borderRadius: "10px", width: "60%"}}
        className="outerGrid"
      >
        <Grid
          item
          xs={12}
          sx={{my: 4}}
        >
          <Typography variant="h2" fontWeight={600} textAlign="center">
            CosmWasm Simulator
          </Typography>
        </Grid>
        <WelcomeNavIcons>
          <SvgIconWrapper icon={LunaIcon} name={'Terra'}/>
          <SvgIconWrapper icon={InjectiveIcon} name={'Injective'}/>
          <SvgIconWrapper icon={OsmosisIcon} name={'Osmosis'}/>
          <SvgIconWrapper icon={JunoSvgIcon} name={'Juno'}/>
        </WelcomeNavIcons>
        <Grid
          item
          xs={11}
          lg={7}
          md={8}
          sx={{my: 4, width: "60%"}}
        >
          <FileUploadPaper sx={{minHeight: 280}}>
            <FileUpload onAccept={onAcceptFile} onClear={onClearFile}/>
          </FileUploadPaper>
        </Grid>
      </Grid>
    </Grid>
  );
};

interface ISvgIconWrapperProps {
  icon: any;
  fontSize?: number;
  name: string;
}

const SvgIconWrapper = ({icon, fontSize, name}: ISvgIconWrapperProps) => {
  const theme = useTheme();
  const [iconName, setIconName] = useState<string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const backgroundColor = isClicked ? theme.palette.primary.main : theme.palette.background.default;
  const handleClick = (event: React.MouseEvent) => {
    setIconName(name);
    setIsClicked(!isClicked);
  };

  return (
    <Stack onClick={handleClick}>
      <Box sx={{bgcolor: backgroundColor, borderRadius: '50%'}}>
        <SvgIcon component={icon} style={{fontSize: fontSize ?? 60}} inheritViewBox/>
      </Box>
      <Typography fontWeight={300} textAlign="center">
        {name}
      </Typography>
    </Stack>
  )
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
      sx={{my: 4}}
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
