import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import {
  Divider,
  Grid,
  Paper,
  Slide,
  StepContent,
  StepLabel,
  Typography,
} from "@mui/material";
import { blockState } from "../../atoms/blockState";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import { ComparePopup } from "./ComparePopup";
import { stepRequestState } from "../../atoms/stepRequestState";
import { stepResponseState } from "../../atoms/stepResponseState";
import { executionHistoryState } from "../../atoms/executionHistoryState";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";
import { stepTraceState } from "../../atoms/stepTraceState";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import traceState from "../../atoms/traceState";
import { JSONTree } from "react-json-tree";

interface IProps {
  chainId: string;
  contractAddress: string;
}
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

export default function StateStepper({ chainId, contractAddress }: IProps) {
  const [currentState, _] = useAtom(currentStateNumber);
  const [activeStep, setActiveStep] = React.useState(0);
  const [, setStepState] = useAtom(blockState);
  const [isOpen, setIsOpen] = React.useState(false);
  const [, stepRequestObj] = useAtom(stepRequestState);
  const [, stepResponseObj] = useAtom(stepResponseState);
  const [allLogs, ___] = useAtom(executionHistoryState);
  const setCurrentTab = useSetAtom(stateResponseTabState);
  const trace = useAtomValue(traceState);
  const setStepTrace = useSetAtom(stepTraceState);
  const containerRef = React.useRef();
  const handleStateView = (state: { dict: { [x: string]: string } }) => {
    if (state) {
      setStepState(
        // @ts-ignore
        JSON.parse(`{\"state\":${window.atob(state?._root.entries[0][1])}}`)
      );
    } else {
      //TODO: Replace it with some relevant message.
      setStepState(JSON.parse('{"state":"No state exists"}'));
    }
  };

  const executionHistory = allLogs[contractAddress];
  React.useEffect(() => {
    setActiveStep(executionHistory.length - 1);
  }, [currentState, contractAddress]);

  React.useEffect(() => {
    const executionStep = executionHistory[activeStep];
    handleStateView(executionStep?.state);
    stepRequestObj(executionStep?.request);
    const resp = executionStep?.response.error
      ? { error: executionStep?.response.error }
      : executionStep?.response;
    stepResponseObj(resp);
    if (activeStep > 0) {
      setStepTrace(trace[activeStep - 1]);
    } else {
      setStepTrace([]);
    }
  }, [activeStep, contractAddress]);

  const handleStep = (step: number) => {
    setActiveStep(step);
    setCurrentTab("state");
  };
  return (
    <Grid item sx={{ width: "100%" }}>
      <Stepper
        nonLinear
        activeStep={activeStep}
        orientation="vertical"
        sx={{ width: "90%" }}
      >
        {executionHistory?.map(
          (
            historyObj: {
              request: any;
              response: any;
              state: any;
            },
            index: number
          ) => {
            const { request, response, state } = historyObj;
            const label = Object.keys(request.executeMsg)[0];
            return (
              <Step
                ref={(el) =>
                  activeStep === index &&
                  activeStep === executionHistory.length - 1 &&
                  el?.scrollIntoView()
                }
                key={`${label}${index}`}
                onClick={() => handleStep(index)}
                sx={{
                  "& .MuiStepIcon-root": {
                    color: response.error !== undefined ? "red" : "#00C921",
                  },
                  "& .MuiStepLabel-root .Mui-active": {
                    color: response.error !== undefined ? "#690000" : "#006110",
                  },
                }}
              >
                <StepLabel>
                  <Grid
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                        overflow: "scroll",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        borderTop: "1px solid rgb(0, 0, 0, 0.12)",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          overflow: "scroll",
                          mb: 1,
                        }}
                      >
                        <div style={{ position: "sticky", top: 0 }}>
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
                        </div>
                        <div
                          style={{
                            overflow: "scroll",
                            marginLeft: "1rem",
                          }}
                        >
                          <JSONTree
                            data={request}
                            theme={theme}
                            invertTheme={false}
                          />
                        </div>
                      </Grid>
                      <Divider orientation="vertical" flexItem />
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          overflow: "scroll",
                          position: "relative",
                        }}
                      >
                        <div style={{ position: "sticky", top: 0 }}>
                          <Divider orientation="horizontal" />
                          <Typography
                            variant="caption"
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            Response
                          </Typography>
                          <Divider orientation="horizontal" />
                        </div>
                        <div
                          style={{
                            overflow: "scroll",
                            marginLeft: "1rem",
                          }}
                        >
                          <JSONTree
                            data={response}
                            theme={theme}
                            invertTheme={false}
                          />
                        </div>
                      </Grid>
                    </Paper>
                  )}
                </StepContent>
              </Step>
            );
          }
        )}
      </Stepper>
    </Grid>
  );
}
