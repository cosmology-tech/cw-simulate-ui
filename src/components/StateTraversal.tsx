import React from "react";
import { IState } from "./ExecuteQuery";
import { CustomStepper } from "./CustomStepper";

interface IProps {
  allStates: IState[];
  currentState: number;
  setCurrentState: (val: number) => void;
  setResponse: (val: JSON | undefined) => void;
  setPayload: (val: string) => void;
  setCurrentTab: (val: string) => void;
}
export const StateTraversal = ({
  allStates,
  currentState,
  setCurrentState,
  setResponse,
  setPayload,
  setCurrentTab,
}: IProps) => {
  return (
    <>
      {allStates.map((state: IState, index) => {
        return (
          <CustomStepper
            state={state}
            key={index}
            index={index}
            currentState={currentState}
            setCurrentState={setCurrentState}
            setPayload={setPayload}
            setResponse={setResponse}
            setCurrentTab={setCurrentTab}
          />
        );
      })}
    </>
  );
};
