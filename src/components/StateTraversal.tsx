import React from "react";
import { IState } from "./ExecuteQuery";
import { CustomStepper } from "./CustomStepper";
import { allStatesAtom } from "../atoms/allStatesAtom";
import { useRecoilValue } from "recoil";

export const StateTraversal = () => {
  const allStates = useRecoilValue(allStatesAtom);
  return (
    <>
      {allStates.map((state: IState, index) => {
        return <CustomStepper state={state} key={index} index={index} />;
      })}
    </>
  );
};
