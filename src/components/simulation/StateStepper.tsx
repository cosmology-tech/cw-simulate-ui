import * as React from "react";
import { useState } from "react";
import Stepper from "@mui/material/Stepper";
import { Grid, Step, StepContent, StepLabel } from "@mui/material";
import { blockState } from "../../atoms/blockState";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import { stepRequestState } from "../../atoms/stepRequestState";
import { stepResponseState } from "../../atoms/stepResponseState";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";
import traceState from "../../atoms/traceState";
import { TraceLog } from "@terran-one/cw-simulate/dist/types";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { JSONTree } from "react-json-tree";
import { SubStepper } from "./SubStepper";
import { ComparePopup } from "./ComparePopup";
import { executionHistoryState } from "../../atoms/executionHistoryState";
import { stepTraceState } from "../../atoms/stepTraceState";

interface IProps {
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
export default function StateStepper({ contractAddress }: IProps) {
  const [currentState, _] = useAtom(currentStateNumber);
  const [activeStep, setActiveStep] = React.useState(0);
  const [, setStepState] = useAtom(blockState);
  const [isOpen, setIsOpen] = React.useState(false);
  const [, stepRequestObj] = useAtom(stepRequestState);
  const [, stepResponseObj] = useAtom(stepResponseState);
  const [allLogs, ___] = useAtom(executionHistoryState);
  const setCurrentTab = useSetAtom(stateResponseTabState);
  const trace = useAtomValue(traceState);
  console.log(trace);
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
      setStepTrace(trace[activeStep]);
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
                    color: response.error !== undefined ? "red" : "",
                  },
                  "& .MuiStepLabel-root .Mui-active": {
                    color: response.error !== undefined ? "#690000" : "",
                  },
                }}
              >
                <StepLabel>
                  <Grid
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid container alignItems="center">
                      {trace[index].trace && trace[index].trace!.length > 0 ? (
                        activeStep === index && isOpen ? (
                          <ArrowDropDownIcon onClick={() => setIsOpen(false)} />
                        ) : (
                          <ArrowRightIcon
                            onClick={() => {
                              setIsOpen(true);
                            }}
                          />
                        )
                      ) : (
                        ""
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
                  {activeStep === index &&
                    isOpen &&
                    trace[index].trace &&
                    index > 0 && <SubStepper traceLog={trace[index].trace} />}
                </StepContent>
              </Step>
            );
          }
        )}
      </Stepper>
    </Grid>
  );
}
