import useTheme from "@mui/material/styles/useTheme";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Grid,
  SvgIcon,
  TextField,
  Typography
} from "@mui/material";
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
import FileUpload, { extractByteCode } from "../upload/FileUpload";
import FileUploadPaper from "../upload/FileUploadPaper";
import { ReactComponent as TerraIcon } from "@public/luna.svg";
import { ReactComponent as InjectiveIcon } from "@public/injective.svg";
import JunoSvgIcon from "./JunoIcon";
import { ReactComponent as OsmosisIcon } from "@public/osmosis.svg";
import axios from "axios";

export interface ISampleContract {
  name: string;
  id: string;
  chain: string;
  keys: string[];
}

const getChainConfig = (chain: Chains) => defaults.chains[chain];

const SAMPLE_CONTRACTS: ISampleContract[] = [
  {
    name: "TerraSwap",
    id: "terra-swap",
    chain: "terra",
    keys: ["terraswap_factory.wasm", "terraswap_pair.wasm", "terraswap_router.wasm", "terraswap_token.wasm"]
  },
];

interface SimulationFileType {
  filename: string;
  fileContent: Buffer | JSON;
}

const getSampleContractsForChain = (chain: string) => {
  return SAMPLE_CONTRACTS.filter((c) => c.chain === chain).map((c) => c.name);
};

export default function WelcomeScreen() {
  const sim = useSimulation();
  const [files, setFiles] = useState<SimulationFileType[]>([]);
  const setNotification = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const [chain, setChain] = useState<Chains>('terra');
  const [sampleContract, setSampleContract] = useState<string>('');
  const handleLoadSampleContract = useCallback(async () => {
    const contract = SAMPLE_CONTRACTS.find((c) => c.name === sampleContract && c.chain === chain);
    if (!contract) {
      setNotification("Contract not found", {severity: "error"});
      return;
    }

    let wasmFiles: SimulationFileType[] = [];
    for (const key of contract.keys) {
      try {
        const response = await axios.get(`/r2/${contract.id}/${key}`, {responseType: "arraybuffer"});
        const wasmFile = Buffer.from(extractByteCode(response.data));
        const newFile = {
          filename: key,
          fileContent: wasmFile
        };
        wasmFiles.push(newFile);
      } catch (e) {
        console.error(e);
        setNotification("Failed to load sample contract", {severity: "error"});
      }
    }
    setFiles(wasmFiles);
  }, [sampleContract]);

  const onCreateNewEnvironment = useCallback(async () => {
    if (!files) {
      setNotification("Internal error. Please check logs.", {
        severity: "error",
      });
      return;
    }

    if (files[0].filename.endsWith(".wasm")) {
      const chainConfig = getChainConfig(chain);
      sim.recreate(chainConfig);
      sim.setBalance(chainConfig.sender, chainConfig.funds);
      for (const file of files) {
        sim.storeCode(chainConfig.sender, file.filename, file.fileContent as Buffer, chainConfig.funds);
      }
    } else if (files[0].filename.endsWith(".json")) {
      // TODO: rehydrate from JSON
      // const json = files.fileContent as unknown;
      sim.recreate(defaults.chains.terra);
    }
  }, [sim, files, chain]);

  const onAcceptFile = useCallback(
    async (filename: string, fileContent: Buffer | JSON) => {
      setFiles(prevFiles => [...prevFiles, {filename, fileContent}]);
    },
    []
  );

  const onClearFile = useCallback(() => {
    setFiles([]);
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      onCreateNewEnvironment().then((r) => {
        navigate("/accounts");
      });
    }
  }, [files]);

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
            <Grid container direction="row" height="100%">
              <Grid item sx={{width: '50%'}}>
                <FileUpload onAccept={onAcceptFile} onClear={onClearFile}/>
              </Grid>
              <Grid item sx={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Typography textAlign="center" sx={{fontWeight: 'bold'}}>
                  Load from sample contracts
                </Typography>
                <Autocomplete
                  onInputChange={(_, value) => setSampleContract(value)}
                  sx={{width: "80%", mt: 2}}
                  renderInput={(params: AutocompleteRenderInputParams) =>
                    <TextField {...params} label="Contract"/>
                  }
                  options={getSampleContractsForChain(chain)}
                />
                <Button variant={'contained'} sx={{mt: 2}} onClick={handleLoadSampleContract}>
                  Load
                </Button>
              </Grid>
            </Grid>
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
