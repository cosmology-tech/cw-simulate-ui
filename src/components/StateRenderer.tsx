import {Typography} from "antd";
import React from "react";
import {BeforeAfterState} from './BeforeAfterState';
import StateMemoryTab from './StateMemoryTab';
import {OutputCard} from './OutputCard';
import {IState} from "./ExecuteQuery";
interface IProps {
  isFileUploaded: boolean;
  allStates: IState[];
  currentStateNumber: number;
}
export const StateRenderer = ({
  isFileUploaded,
  allStates,
  currentStateNumber
}: IProps) => {
  const [currentTab, setCurrentTab] = React.useState("state");
  let currentObject = undefined;
  if (currentTab === "state") {
    const currentState = window.VM?.backend?.storage.dict['c3RhdGU='];
    currentObject = currentState === undefined ? undefined : JSON.parse(window.atob(currentState))
    return (
      <div style={{display: "flex", flexDirection: "column"}}>
        <StateMemoryTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {
          isFileUploaded && allStates && allStates.length - 1 > 0 && allStates.length - 1 !== currentState ?
            <BeforeAfterState allStates={allStates} currentState={currentState} /> :
            <OutputCard response={currentObject} placeholder="Your state will appear here." />
        }
      </div>
    );
  } else if (window.enableMemory && currentTab === "memory") {
    const currentMemory = window.VM?.exports?.memory;//.dict['c3RhdGU='];
    currentObject = currentMemory;
    return (
      <div style={{display: "flex", flexDirection: "column"}}>
        <StateMemoryTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <OutputCard response={currentObject} placeholder={`${currentTab} will appear here.`} />
      </div>
    );
  }
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <StateMemoryTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <OutputCard response={currentObject} placeholder={`${currentTab} will appear here.`} />
    </div>
  );

};
export default StateRenderer;