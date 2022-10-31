import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { Grid, StepLabel } from "@mui/material";
import { blockState } from "../../atoms/blockState";
import { useAtom } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import { ComparePopup } from "./ComparePopup";
import { stepRequestState } from "../../atoms/stepRequestState";
import { stepResponseState } from "../../atoms/stepResponseState";
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

  const handleStateView = (state: { dict: { [x: string]: string } }) => {
    if (state) {
      // @ts-ignore
      setStepState(JSON.parse(window.atob(state?._root.entries[0][1])));
    } else {
      //TODO: Replace it with some relevant message.
      setStepState(JSON.parse('{"state":"No state exists"}'));
    }
  };

  const executionHistory: any[] = useAtom(traceState)[0];

  React.useEffect(() => {
    setActiveStep(executionHistory.length - 1);
  }, [currentState, contractAddress]);

  React.useEffect(() => {
    handleStateView(executionHistory[activeStep]?.execute.state);
    stepRequestObj(executionHistory[activeStep]?.request);
    stepResponseObj(executionHistory[activeStep]?.execute.response);
  }, [activeStep, contractAddress]);

  const handleStep = (step: number) => {
    setActiveStep(step);
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
              execute: { response: any; executeMsg: any; subcalls: any };
            },
            index: number
          ) => {
            const { response, executeMsg, subcalls } = historyObj.execute;
            const label = Object.keys(executeMsg)[0];
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
                    color: response.error ? "red" : "#00C921",
                  },
                  "& .MuiStepLabel-root .Mui-active": {
                    color: response.error ? "#690000" : "#006110",
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
