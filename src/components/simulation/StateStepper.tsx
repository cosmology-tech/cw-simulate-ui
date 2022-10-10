import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Popover,
  Slide,
  StepContent,
  StepLabel,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { JSONTree } from "react-json-tree";
import { blockState } from "../../atoms/blockState";
import { useExecutionHistory } from "../../utils/simulationUtils";
import { useAtom } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import { ComparePopup } from "./ComparePopup";

const theme = {
  scheme: "chalk",
  author: "chris kempson (http://chriskempson.com)",
  base00: "#FFFFFF",
  base01: "#202020",
  base02: "#303030",
  base03: "#505050",
  base04: "#b0b0b0",
  base05: "#d0d0d0",
  base06: "#e0e0e0",
  base07: "#f5f5f5",
  base08: "#fb9fb1",
  base09: "#eda987",
  base0A: "#ddb26f",
  base0B: "#acc267",
  base0C: "#12cfc0",
  base0D: "#6fc2ef",
  base0E: "#e1a3ee",
  base0F: "#deaf8f",
};

interface IProps {
  chainId: string;
  contractAddress: string;
}

export default function StateStepper({ chainId, contractAddress }: IProps) {
  const executeHistory = useExecutionHistory();
  const executionHistory = executeHistory(chainId, contractAddress);
  const [currentState, _] = useAtom(currentStateNumber);
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [, setStepState] = useAtom(blockState);
  const handleStateView = (state: { dict: { [x: string]: string } }) => {
    if (state) {
      // @ts-ignore
      setStepState(JSON.parse(window.atob(state?.dict._root.entries[0][1])));
    } else {
      //TODO: Replace it with some relevant message.
      setStepState(JSON.parse('{"state":"No state exists"}'));
    }
  };

  const handleStep =
    (step: number, state: { dict: { [x: string]: string } }) => () => {
      setActiveStep(step);
    };
  React.useEffect(() => {
    setActiveStep(executionHistory.length - 1);
  }, [currentState, contractAddress]);

  React.useEffect(() => {
    handleStateView(executionHistory[activeStep]?.state);
  }, [activeStep]);
  return (
    <Stepper nonLinear activeStep={activeStep} orientation="vertical">
      {executionHistory?.map(
        (
          historyObj: { request: any; response: any; state: any },
          index: number
        ) => {
          const { request, response, state } = historyObj;
          const label = Object.keys(request)[2];

          return (
            <Step
              key={`${label}${index}`}
              onClick={handleStep(index, state)}
              sx={{
                "& .MuiStepIcon-root": {
                  color: response.error ? "red" : "#00C921",
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: response.error ? "#690000" : "#006110",
                },
              }}
            >
              <StepLabel>
                <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid container alignItems="center">
                    {activeStep === index && isOpen ? (
                      <ArrowDropDownIcon onClick={() => setIsOpen(false)} />
                    ) : (
                      <ArrowRightIcon
                        onClick={() => {
                          handleStateView(state);
                          setIsOpen(true);
                        }}
                      />
                    )}
                    {label}
                  </Grid>
                  {executionHistory.length > 1 && (
                    <ComparePopup
                      currentActiveState={activeStep}
                      executionHistory={executionHistory}
                    />
                  )}
                </Grid>
              </StepLabel>

              <StepContent>
                {activeStep === index && isOpen && (
                  <Paper
                    elevation={3}
                    sx={{
                      height: "30vh",
                      overflow: "auto",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      borderTop: "1px solid rgb(0, 0, 0, 0.12)",
                    }}
                  >
                    <Grid
                      item
                      container
                      direction="column"
                      xs={12}
                      sx={{
                        position: "relative",
                        overflow: "auto",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ position: "sticky", top: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "sticky",
                          }}
                        >
                          Request
                        </Typography>
                        <Divider orientation="horizontal" />
                      </Box>
                      <Box
                        sx={{
                          overflow: "auto",
                          marginLeft: "1rem",
                        }}
                      >
                        <JSONTree
                          data={request}
                          theme={theme}
                          invertTheme={false}
                        />
                      </Box>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                        position: "relative",
                      }}
                    >
                      <Box sx={{ position: "sticky", top: 0 }}>
                        <Divider orientation="horizontal" />
                        <Typography
                          variant="caption"
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          Response
                        </Typography>
                        <Divider orientation="horizontal" />
                      </Box>
                      <Box
                        sx={{
                          overflow: "auto",
                          marginLeft: "1rem",
                        }}
                      >
                        <JSONTree
                          data={response}
                          theme={theme}
                          invertTheme={false}
                        />
                      </Box>
                    </Grid>
                  </Paper>
                )}
              </StepContent>
            </Step>
          );
        }
      )}
    </Stepper>
  );
}
