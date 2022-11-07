import { Grid, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { TraceLog } from "@terran-one/cw-simulate";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";

interface IProps {
  traceLog: TraceLog[] | undefined;
}

export const SubStepper = ({ traceLog }: IProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
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
        {traceLog?.map((traceObj: TraceLog, index: number) => {
          return (
            <Step
              ref={(el) =>
                activeStep === index &&
                activeStep === traceLog.length - 1 &&
                el?.scrollIntoView()
              }
              key={`${traceObj.type}-${index}-${crypto.randomUUID()}`}
              onClick={() => handleStep(index)}
            >
              <StepLabel>
                <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid container alignItems="center">
                    {traceObj.trace && traceObj.trace.length > 0 ? (
                      activeStep === index && isOpen ? (
                        <RemoveIcon onClick={() => setIsOpen(false)} />
                      ) : (
                        <AddIcon
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      )
                    ) : (
                      ""
                    )}
                    {traceObj.type === "instantiate" && traceObj.type}
                    {traceObj.type === "execute" &&
                      Object.keys(traceObj.msg)[0]}
                    {traceObj.type === "reply" && `reply: ${traceObj.msg.id}`}
                  </Grid>
                </Grid>
              </StepLabel>
              <StepContent>
                {activeStep === index &&
                  isOpen &&
                  traceObj.trace &&
                  traceObj.trace.length > 0 && (
                    <SubStepper traceLog={traceObj.trace} />
                  )}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Grid>
  );
};
