import * as React from "react";
import { useState } from "react";
import Stepper from "@mui/material/Stepper";
import { Grid, Step, StepContent, StepLabel, } from "@mui/material";
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

interface IProps {
  contractAddress: string;
}

export default function StateStepper({contractAddress}: IProps) {
  const [currentState, _] = useAtom(currentStateNumber);
  const [activeStep, setActiveStep] = useState(0);
  const [, setStepState] = useAtom(blockState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, stepRequestObj] = useAtom(stepRequestState);
  const [, stepResponseObj] = useAtom(stepResponseState);
  const setCurrentTab = useSetAtom(stateResponseTabState);
  const trace = useAtomValue(traceState);
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

  const handleStep = (step: number) => {
    setActiveStep(step);
    setCurrentTab("state");
  };

  const handleRef = (el: HTMLDivElement | null, index: number, trace: TraceLog) => {
    if (el) {
      activeStep === index &&
      trace.trace &&
      activeStep === trace.trace?.length - 1 &&
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  //  Recurse through the trace and build the steps
  const buildSteps = (trace: TraceLog[]) => {
    console.log(activeStep);
    return (
      <Stepper nonLinear
               activeStep={activeStep}
               orientation="vertical"
               sx={{width: "90%"}}>
        {
          trace.map((trace: TraceLog, index: number) => {
            return (
              <Step
                ref={(el: HTMLDivElement | null) => handleRef(el, index, trace)}
                key={`${trace.type}-${index}-${crypto.randomUUID()}`}
                onClick={() => handleStep(index)}>
                <StepLabel>
                  <Grid sx={{display: "flex", justifyContent: "space-between"}}>
                    <Grid container alignItems="center">
                      {activeStep === index && isOpen && trace.trace && trace.trace.length > 0 ? (
                        <ArrowDropDownIcon onClick={() => setIsOpen(false)}/>
                      ) : (
                        <ArrowRightIcon
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      )}
                      {trace.type === "instantiate" && trace.type}
                      {trace.type === "execute" && Object.keys(trace.msg)[0]}
                      {trace.type === "reply" && `reply: ${trace.msg.id}`}
                    </Grid>
                  </Grid>
                </StepLabel>
                <StepContent>
                  <Stepper nonLinear={true} orientation={'vertical'} activeStep={activeStep}>
                    {activeStep === index && isOpen && <JSONTree data={trace.response}/>}
                    {trace.trace && trace.trace.length > 0 && buildSteps(trace.trace)}
                  </Stepper>
                </StepContent>
              </Step>
            )
          })
        }
      </Stepper>
    )
  }

  return (
    <Grid item sx={{width: "100%"}}>
      {buildSteps(trace)}
    </Grid>
  )
  // return (
  //   <Grid item sx={{width: "100%"}}>
  //     <Stepper
  //       nonLinear
  //       activeStep={activeStep}
  //       orientation="vertical"
  //       sx={{width: "90%"}}
  //     >
  //       {executionHistory?.map(
  //         (
  //           historyObj: {
  //             request: any;
  //             response: any;
  //             state: any;
  //           },
  //           index: number
  //         ) => {
  //           const {request, response, state} = historyObj;
  //           const label = Object.keys(request.executeMsg)[0];
  //           return (
  //             <Step
  //               ref={(el) =>
  //                 activeStep === index &&
  //                 activeStep === executionHistory.length - 1 &&
  //                 el?.scrollIntoView()
  //               }
  //               key={`${label}${index}`}
  //               onClick={() => handleStep(index)}
  //               sx={{
  //                 "& .MuiStepIcon-root": {
  //                   color: response.error !== undefined ? "red" : "#00C921",
  //                 },
  //                 "& .MuiStepLabel-root .Mui-active": {
  //                   color: response.error !== undefined ? "#690000" : "#006110",
  //                 },
  //               }}
  //             >
  //               <StepLabel>
  //                 <Grid
  //                   sx={{display: "flex", justifyContent: "space-between"}}
  //                 >
  //                   <Grid container alignItems="center">
  //                     {activeStep === index && isOpen ? (
  //                       <ArrowDropDownIcon onClick={() => setIsOpen(false)}/>
  //                     ) : (
  //                       <ArrowRightIcon
  //                         onClick={() => {
  //                           handleStateView(state);
  //                           setIsOpen(true);
  //                         }}
  //                       />
  //                     )}
  //                     {label}
  //                   </Grid>
  //                   {executionHistory.length > 1 && (
  //                     <ComparePopup
  //                       currentActiveState={activeStep}
  //                       executionHistory={executionHistory}
  //                     />
  //                   )}
  //                 </Grid>
  //               </StepLabel>
  //               <StepContent>
  //                 {activeStep === index && isOpen && trace.length > 0 && (
  //                   <SubStepper traceLog={trace}/>
  //                 )}
  //               </StepContent>
  //             </Step>
  //           );
  //         }
  //       )}
  //     </Stepper>
  //   </Grid>
  // );
}
