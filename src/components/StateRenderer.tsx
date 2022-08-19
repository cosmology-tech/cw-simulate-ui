import { Typography } from "antd";
import React from "react";
import {BeforeAfterState} from './BeforeAfterState';
import StateMemoryTab from './StateMemoryTab';
import {OutputCard} from './OutputCard';
interface IProps {
  isFileUploaded:boolean;
}
export const StateRenderer = ({
  isFileUploaded,
}: IProps) => {
  const [currentTab, setCurrentTab] = React.useState("state");
  const currentState = window.VM?.backend?.storage.dict['c3RhdGU='];
  const currentJSON  = currentState===undefined?undefined:JSON.parse(window.atob(currentState))
  return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <StateMemoryTab currentTab={currentTab} setCurrentTab={setCurrentTab}/>
        <OutputCard response={currentJSON} placeholder="Your state will appear here."/>
      </div>
  );
};
