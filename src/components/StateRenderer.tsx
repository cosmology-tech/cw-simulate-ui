import { Typography } from "antd";
import React from "react";
import {BeforeAfterState} from './BeforeAfterState';
import StateMemoryTab from './StateMemoryTab';
import {OutputCard} from './OutputCard';
import { IState } from "./ExecuteQuery";
interface IProps {
  isFileUploaded:boolean;
  allStates:IState[];
  currentState:number;
}
export const StateRenderer = ({
  isFileUploaded,
  allStates,
  currentState
}: IProps) => {
  const [currentTab, setCurrentTab] = React.useState("state");
  const blockState = window.VM?.backend?.storage.dict['c3RhdGU='];
  const currentJSON  = blockState===undefined?undefined:JSON.parse(window.atob(blockState))
  return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <StateMemoryTab currentTab={currentTab} setCurrentTab={setCurrentTab}/>
       {
       isFileUploaded && allStates && allStates.length-1>0 && allStates.length-1!==currentState?<BeforeAfterState allStates={allStates} currentState={currentState}/>:
        <OutputCard response={currentJSON} placeholder="Your state will appear here."/>
       }
      </div>
  );
};
