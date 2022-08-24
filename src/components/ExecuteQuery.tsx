import React from "react";
import TextBox from "./TextBox";
import { Button, message } from "antd";
import { OutputRenderer } from "./OutputRenderer";
import { Config } from "../config";
import ExecuteQueryTab from "./ExecuteQueryTab";

interface IProps {
  payload: string;
  setPayload: (val: string) => void;
  response:JSON|undefined;
  setResponse:(val:JSON|undefined)=>void;
}

export const ExecuteQuery = ({ payload, setPayload, setResponse, response}: IProps) => {

  const [currentTab, setCurrentTab] = React.useState<string>("execute");
  const { MOCK_ENV, MOCK_INFO } = Config;
  const execute = () => {
    try {
      const res = window.VM.execute(MOCK_ENV, MOCK_INFO, JSON.parse(payload));
      setResponse(res.read_json());
      window.Console.log("Execute success", res.read_json());
      message.success(
        "Execution was successful!"
      );
    } catch (err) {
      message.error("Something went wrong while executing.");
      window.Console.log("Execute error", err);
    }
  };
  const query = () => {
    try {
      const res = window.VM.query(MOCK_ENV, JSON.parse(payload));
      setResponse(JSON.parse(window.atob(res.read_json().ok)));
      window.Console.log("Query success", res.read_json());
      message.success("Query was successful!");
    } catch (err) {
      message.error("Something went wrong while querying.");
      window.Console.log("Query error", err);
    }
  };
  const onRunHandler = () => {
    if(currentTab==='execute') {
        execute();
    }
    else {
        query();
    }
  }
  const onDryRunHandler = () =>{
    console.warn('Have to add something here');
  }
  React.useEffect(()=>{
    setPayload("");
  },[currentTab])

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
    <ExecuteQueryTab currentTab={currentTab} setCurrentTab={setCurrentTab}  />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextBox
          payload={payload}
          setPayload={setPayload}
          placeholder='{ "<name>": {} }'
        />
        <OutputRenderer response={response} />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* TODO: Enable Dry Run */}
        {/* <Button style={{ margin: 10 }} onClick={onDryRunHandler} disabled>Dry-Run</Button> */}
        <Button style={{ margin: 10 }} onClick={onRunHandler} disabled={!payload.length}>Run</Button>
      </div>
    </div>
  );
};
