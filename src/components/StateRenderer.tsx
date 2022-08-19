import { Typography } from "antd";
import React from "react";
import {BeforeAfterState} from './BeforeAfterState';
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
    <> This is work in progress</>
  );
};
