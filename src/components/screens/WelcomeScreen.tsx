import useTheme from "@mui/material/styles/useTheme";
import { Box, Grid, SvgIcon, Typography } from "@mui/material";
import React, {
  ComponentType,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { Chains, defaults } from "../../configs/constants";
import useSimulation from "../../hooks/useSimulation";
import FileUpload from "../upload/FileUpload";
import FileUploadPaper from "../upload/FileUploadPaper";
import { ReactComponent as TerraIcon } from "@public/luna.svg";
import { ReactComponent as InjectiveIcon } from "@public/injective.svg";
import JunoSvgIcon from "./JunoIcon";
import { ReactComponent as OsmosisIcon } from "@public/osmosis.svg";

const getChainConfig = (chain: Chains) => defaults.chains[chain];

export default function WelcomeScreen() {
  const sim = useSimulation();

  const [file, setFile] =
    useState<{ filename: string; fileContent: Buffer | JSON } | undefined>(
      undefined
    );
  const setNotification = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const [chain, setChain] = useState<Chains>('terra');

  const onCreateNewEnvironment = useCallback(async () => {
    if (!file) {
      setNotification("Internal error. Please check logs.", {
        severity: "error",
      });
      return;
    }

    if (file.filename.endsWith(".wasm")) {
      const chainConfig = getChainConfig(chain);
      sim.recreate(chainConfig);
      sim.setBalance(chainConfig.sender, chainConfig.funds);
      sim.storeCode(chainConfig.sender, file.filename, file.fileContent as Buffer, chainConfig.funds);
    } else if (file.filename.endsWith(".json")) {
      // TODO: rehydrate from JSON
      // const json = file.fileContent as unknown;
      sim.recreate(defaults.chains.terra);
    }
  }, [sim, file, chain]);

  const onAcceptFile = useCallback(
    async (filename: string, fileContent: Buffer | JSON) => {
      setFile({filename, fileContent});
    },
    []
  );

  const onClearFile = useCallback(() => {
    setFile(undefined);
  }, []);

  useEffect(() => {
    if (file) {
      onCreateNewEnvironment().then((r) => {
        navigate("/accounts");
      });
    }
  }, [file]);

  return (
    <Grid container item flex={1} alignItems="center" justifyContent="center">
      <Grid
        xs={12}
        md={10}
        lg={10}
        xl={8}
        container
        item
        justifyContent="center"
        sx={{
          border: `1px solid ${theme.palette.line}`,
          borderRadius: "10px",
          width: "60%",
          py: 10
        }}
        className="outerGrid"
      >
        <Grid item xs={12} sx={{my: 4}}>
          <Typography variant="h2" fontWeight={600} textAlign="center">
            CWSimulate
          </Typography>
        </Grid>
        <Grid item xs={11} lg={7} md={8} sx={{mb: 4, width: "60%"}}>
          <Typography variant="h6" textAlign="center">
            Select a configuration
          </Typography>
          <FileUploadPaper sx={{minHeight: 200}}>
            <WelcomeNavIcons>
              <SvgIconWrapper
                IconComponent={TerraIcon}
                label="Terra"
                isSelected={chain === 'terra'}
                onClick={() => {
                  setChain('terra')
                }}
              />
              <SvgIconWrapper
                IconComponent={JunoSvgIcon}
                label="Juno"
                isSelected={chain === 'juno'}
                onClick={() => {
                  setChain('juno')
                }}
              />
              <SvgIconWrapper
                IconComponent={OsmosisIcon}
                label="Osmosis"
                subLabel="Coming soon"
              />
              <SvgIconWrapper
                IconComponent={InjectiveIcon}
                label="Injective"
                subLabel="Coming soon"
              />
            </WelcomeNavIcons>
          </FileUploadPaper>
        </Grid>
        <Grid item xs={11} lg={7} md={8} sx={{mb: 4, width: "60%"}}>
          <FileUploadPaper sx={{minHeight: 200}}>
            <FileUpload onAccept={onAcceptFile} onClear={onClearFile}/>
          </FileUploadPaper>
        </Grid>
      </Grid>
    </Grid>
  );
}

interface ISvgIconWrapperProps {
  IconComponent: ComponentType;
  fontSize?: number;
  label: string;
  subLabel?: string;
  isSelected?: boolean;
  backgroundColor?: string;
  onClick?: (e: MouseEvent) => void;
}

const SvgIconWrapper = ({
  IconComponent,
  fontSize,
  label,
  subLabel,
  isSelected,
  onClick,
}: ISvgIconWrapperProps) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          opacity: onClick ? 1 : 0.5,
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={(event) => onClick ? onClick(event) : undefined}
      >
        <Box
          sx={{
            bgcolor:
              isSelected
                ? theme.palette.primary.light
                : theme.palette.background.default,
            borderRadius: 2,
          }}
        >
          <SvgIcon
            component={IconComponent}
            style={{fontSize: fontSize ?? 60}}
            inheritViewBox
          />
        </Box>
        <Typography fontWeight={300} textAlign="center">
          {label}
        </Typography>
        {subLabel && (<Typography fontSize={10} textAlign="center">{subLabel}</Typography>)}
      </Box>
    </>
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
      sx={{my: 4}}
    >
      {children}
    </Grid>
  );
}
