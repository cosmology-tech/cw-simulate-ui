import React from "react";
import TextBox from "./TextBox";
import { Button, message } from "antd";
import { OutputRenderer } from "./OutputRenderer";
import { Config } from "../config";
import ExecuteQueryTab from "./ExecuteQueryTab";

interface IProps {
  payload: string;
  setPayload: (val: string) => void;
}

export const ExecuteQuery = ({ payload, setPayload }: IProps) => {
  const [response, setResponse] = React.useState<JSON | undefined>();
  const [currentTab, setCurrentTab] = React.useState<string>("execute");
  const { MOCK_ENV, MOCK_INFO } = Config;
  const execute = () => {
    try {
      const res = window.VM.execute(MOCK_ENV, MOCK_INFO, JSON.parse(payload));
      setResponse(res.read_json());
      console.log("Execute", res.read_json());
      message.success(
        "Execution was successfull! Check Execute Output for Output."
      );
    } catch (err) {
      message.error("Something went wrong while executing.");
    }
  };
  const query = () => {
    try {
      const res = window.VM.query(MOCK_ENV, JSON.parse(payload));
      setResponse(JSON.parse(window.atob(res.read_json().ok)));
      console.log("Query ", res.read_json());
      message.success("Query was successfull!");
    } catch (err) {
      message.error("Something went wrong while querying.");
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
    console.log('Have to add something here');
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
          placeholder="Type your message here"
        />
        <OutputRenderer response={response} />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button style={{ margin: 10 }} onClick={onDryRunHandler} disabled>Dry-Run</Button>
        <Button style={{ margin: 10 }} onClick={onRunHandler} disabled={!payload.length}>Run</Button>
      </div>
    </div>
  );
};
