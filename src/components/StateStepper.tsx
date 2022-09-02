import { Steps } from "antd";
import React, { useState } from "react";
import { IState } from "./ExecuteQuery";
const { Step } = Steps;

interface IProps {
  currentState: number;
  setCurrentState: (val: number) => void;
  allStates: IState[];
  setResponse: (val: JSON | undefined) => void;
  setPayload: (val: string) => void;
  setCurrentTab: (val: string) => void;
}

const StateStepper = ({
  currentState,
  setCurrentState,
  allStates,
  setResponse,
  setPayload,
  setCurrentTab,
}: IProps) => {
  const onChange = (value: number) => {
    setCurrentState(value);
    setCurrentTab(allStates[value].currentTab);
    setResponse(allStates[value].res);
    setPayload(allStates[value].payload);
  };

  return allStates.length ? (
    <Steps
      current={currentState}
      onChange={onChange}
      size="small"
      style={{ margin: "20px" }}
    >
      {allStates.map((state: IState, index) => (
        <Step title="State" description={state.currentTab} key={index} />
      ))}
    </Steps>
  ) : (
    <></>
  );
};

export default StateStepper;
