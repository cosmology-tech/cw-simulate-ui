import React from "react";
import { Button, message } from "antd";
import { OutputRenderer } from "./OutputRenderer";
import { Config } from "../config";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "./JsonCodeMirrorEditor";

interface IProps {
  payload: string;
  setPayload: (val: string) => void;
  response: JSON | undefined;
  setResponse: (val: JSON | undefined) => void;
  allStates: IState[];
  setAllStates: (val: IState[]) => void;
  currentState: number;
  setCurrentState: (val: number) => void;
  currentTab: string;
  setCurrentTab: (val: string) => void;
}

export interface IState {
  chainStateBefore: string;
  payload: string;
  currentTab: string;
  chainStateAfter: string;
  res: JSON | undefined;
}
export const ExecuteQuery = ({
  payload,
  setPayload,
  setResponse,
  response,
  setAllStates,
  allStates,
  setCurrentState,
  currentState,
  currentTab,
  setCurrentTab,
}: IProps) => {
  const { MOCK_ENV, MOCK_INFO } = Config;
  const addState = (stateBefore: any, res: any) => {
    const stateObj: IState = {
      chainStateBefore: stateBefore,
      payload: payload,
      currentTab: currentTab,
      chainStateAfter: window.VM?.backend?.storage.dict["c3RhdGU="],
      res: res.read_json(),
    };
    setAllStates([...allStates, stateObj]);
    setCurrentState(allStates.length);
  };

  const execute = () => {
    try {
      const stateBefore = window.VM?.backend?.storage.dict["c3RhdGU="];
      const res = window.VM.execute(MOCK_ENV, MOCK_INFO, JSON.parse(payload));
      setResponse(res.read_json());
      if (!(res.read_json().error && res.read_json().error.length > 0)) {
        addState(stateBefore, res);
        window.Console.log("Execute success", res.read_json());
        message.success("Execution was successful!");
      } else {
        throw res.read_json().error;
      }
    } catch (err) {
      message.error("Something went wrong while executing.");
      window.Console.log("Execute error", err);
    }
  };
  const query = () => {
    try {
      const stateBefore = window.VM?.backend?.storage.dict["c3RhdGU="];
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
    if (currentTab === "execute") {
      execute();
    } else {
      query();
    }
  };
  const onDryRunHandler = () => {
    console.log("Have to add something here");
  };
  React.useEffect(() => {
    if (currentState === allStates.length - 1) {
      setPayload("");
    }
  }, [currentTab]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ExecuteQueryTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <JsonCodeMirrorEditor payload={payload} setPayload={setPayload} />
        <OutputRenderer response={response} />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* TODO: Enable Dry Run */}
        {/* <Button style={{ margin: 10 }} onClick={onDryRunHandler} disabled>Dry-Run</Button> */}
        <Button
          style={{ margin: 10 }}
          onClick={onRunHandler}
          disabled={!payload.length}
        >
          Run
        </Button>
      </div>
    </div>
  );
};
