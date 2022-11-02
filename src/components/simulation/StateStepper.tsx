import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { Grid, StepLabel } from "@mui/material";
import { blockState } from "../../atoms/blockState";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import { ComparePopup } from "./ComparePopup";
import { stepRequestState } from "../../atoms/stepRequestState";
import { stepResponseState } from "../../atoms/stepResponseState";
import { executionHistoryState } from "../../atoms/executionHistoryState";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";
import { stepTraceState } from "../../atoms/stepTraceState";
import traceState from "../../atoms/traceState";

interface IProps {
  chainId: string;
  contractAddress: string;
}

export default function StateStepper({ chainId, contractAddress }: IProps) {
  const [currentState, _] = useAtom(currentStateNumber);
  const [activeStep, setActiveStep] = React.useState(0);
  const [, setStepState] = useAtom(blockState);
  const [, stepRequestObj] = useAtom(stepRequestState);
  const [, stepResponseObj] = useAtom(stepResponseState);
  const [allLogs, ___] = useAtom(executionHistoryState);
  const setCurrentTab = useSetAtom(stateResponseTabState);
  const trace = useAtomValue(traceState);
  const setStepTrace = useSetAtom(stepTraceState);
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
              </Step>
            );
          }
        )}
      </Stepper>
    </Grid>
  );
}
