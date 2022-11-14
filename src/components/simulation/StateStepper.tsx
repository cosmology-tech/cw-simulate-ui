import * as React from "react";
import Stepper from "@mui/material/Stepper";
import { Grid, Step, StepContent, StepLabel } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  currentStateNumber,
  stepRequestState,
  stepResponseState,
  stateResponseTabState,
  traceState,
  blockState,
  stepTraceState,
} from "../../atoms/simulationPageAtoms";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { SubStepper } from "./SubStepper";
import { ComparePopup } from "./ComparePopup";
import { useEffect, useState } from "react";
import { Map } from "immutable";
import { TraceLog } from "@terran-one/cw-simulate";

interface IProps {
  contractAddress: string;
}

export default function StateStepper({ contractAddress }: IProps) {
  const [currentState, _] = useAtom(currentStateNumber);
  const [activeStep, setActiveStep] = useState(0);
  const [, setStepState] = useAtom(blockState);
  const [isOpen, setIsOpen] = useState(false);
  const [, stepRequestObj] = useAtom(stepRequestState);
  const [, stepResponseObj] = useAtom(stepResponseState);
  const setCurrentTab = useSetAtom(stateResponseTabState);
  const trace = useAtomValue(traceState);
  const setStepTrace = useSetAtom(stepTraceState);
  const handleStateView = (state: Map<string, any>) => {
    const entries =
      //@ts-ignore
      state?._root.entries[0][1]?._root?.entries[2][1]?._root?.entries[0][1]
        ?._root?.entries;
    setStepState(
      JSON.parse(
        `{\"${window.atob(entries[0][0])}\":${window.atob(entries[0][1])}}`
      )
    );
  };

  const getRequestObject = (currentTrace: TraceLog) => {
    const { env, type, msg } = currentTrace;
    const responseObj = {
      env: env,
      info:
        type === "execute" || type === "instantiate" ? currentTrace.info : {},
      executeMsg: type === "instantiate" ? { instantiate: msg } : msg,
    };
    return responseObj;
  };
  useEffect(() => {
    setActiveStep(trace.length - 1);
  }, [currentState, contractAddress]);

  useEffect(() => {
    const executionStep = trace[activeStep];
    handleStateView(executionStep?.storeSnapshot);
    stepRequestObj(getRequestObject(executionStep));
    //@ts-ignore
    const resp = executionStep?.response.error
      ? //@ts-ignore
        { error: executionStep?.response.error }
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
    setCurrentTab("response");
  };

  return (
    <Grid item sx={{ width: "100%"}}>

      <Stepper
        nonLinear
        activeStep={activeStep}
        orientation="vertical"
        sx={{ width: "90%" }}
      >
        {trace?.map((infoObj, index: number) => {
          const { response } = infoObj;
          const request = getRequestObject(infoObj);
          const label = Object.keys(request.executeMsg)[0];
          return (
            <Step
              ref={(el) =>
                activeStep === index &&
                activeStep === trace.length - 1 &&
                el?.scrollIntoView()
              }
              key={`${label}${index}`}
              onClick={() => handleStep(index)}
              sx={{
                "& .MuiStepIcon-root": {
                  //@ts-ignore
                  color: response.error ? "red" : "",
                },
                "& .MuiStepLabel-root .Mui-active": {
                  //@ts-ignore
                  color: response.error !== undefined ? "#690000" : "",
                },
              }}
            >
              <StepLabel>
                <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid container alignItems="center">
                    {trace[index].trace && trace[index].trace!.length > 0 ? (
                      activeStep === index && isOpen ? (
                        <RemoveIcon
                          fontSize="small"
                          onClick={() => setIsOpen(false)}
                        />
                      ) : (
                        <AddIcon
                          fontSize="small"
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
                  {trace.length > 1 && (
                    <ComparePopup
                      currentActiveState={activeStep}
                      trace={trace}
                    />
                  )}
                </Grid>
              </StepLabel>
              <StepContent>
                {activeStep === index &&
                  isOpen &&
                  infoObj.trace &&
                  index > 0 && <SubStepper traceLog={infoObj.trace} />}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Grid>
  );
}
