import React from "react";
import { IState } from "./ExecuteQuery";
import { CustomStepper } from "./CustomStepper";
import { useRecoilState, useRecoilValue } from "recoil";
import { allStatesAtom } from "../atoms/allStatesAtom";
import { currentStateNumber } from "../atoms/currentStateNumber";
import { responseState } from "../atoms/responseState";
import { payloadState } from "../atoms/payloadState";
import { executeQueryTabState } from "../atoms/executeQueryTabState";

export const StateTraversal = () => {
  const [response, setResponse] = useRecoilState(responseState);
  const allStates = useRecoilValue(allStatesAtom);
  const [currentState, setCurrentState] = useRecoilState(currentStateNumber);
  const [payload, setPayload] = useRecoilState(payloadState);
  const [currentTab, setCurrentTab] = useRecoilState(executeQueryTabState);
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
