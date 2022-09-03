import React from "react";
import { OutputRenderer } from "./OutputRenderer";
import { Config } from "../configs/config";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "./JsonCodeMirrorEditor";
import { useRecoilState, useRecoilValue } from "recoil";
import { snackbarNotificationAtom } from "../atoms/snackbarNotificationAtom";
import { executeQueryTabAtom } from "../atoms/executeQueryTabAtom";
import consoleLogsAtom from "../atoms/consoleLogsAtom";
import { Button } from "@mui/material";

interface IProps {
  payload: string;
  setPayload: (val: string) => void;
  response: JSON | undefined;
  setResponse: (val: JSON | undefined) => void;
  allStates: IState[];
  setAllStates: (val: IState[]) => void;
  currentState: number;
  setCurrentState: (val: number) => void;
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
                             }: IProps) => {
  const {MOCK_ENV, MOCK_INFO} = Config;
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(snackbarNotificationAtom);
  const executeQueryTab = useRecoilValue(executeQueryTabAtom);
  const [consoleLogs, setConsoleLogs] = useRecoilState(consoleLogsAtom);
  const addState = (stateBefore: any, res: any) => {
    const stateObj: IState = {
      chainStateBefore: stateBefore,
      payload: payload,
      currentTab: executeQueryTab,
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
        setConsoleLogs([...consoleLogs, "Execute success", res.read_json()]);
        setSnackbarNotification({
          ...snackbarNotification,
          severity: 'success',
          open: true,
          message: "Execution was successful!"
        });
      } else {
        throw res.read_json().error;
      }
    } catch (err) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: 'error',
        open: true,
        message: "Something went wrong while executing."
      });
      setConsoleLogs([...consoleLogs, "Execute error", err]);
    }
  };
  const query = () => {
    try {
      const stateBefore = window.VM?.backend?.storage.dict["c3RhdGU="];
      const res = window.VM.query(MOCK_ENV, JSON.parse(payload));
      setResponse(JSON.parse(window.atob(res.read_json().ok)));
      setConsoleLogs([...consoleLogs, "Query success", res.read_json()]);
      setSnackbarNotification({
        ...snackbarNotification,
        open: true,
        message: "Query was successful!"
      });
    } catch (err) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: 'error',
        open: true,
        message: "Something went wrong while querying."
      });
      setConsoleLogs([...consoleLogs, "Query error", err]);
    }
  };
  const onRunHandler = () => {
    if (executeQueryTab === "execute") {
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
  }, [executeQueryTab]);

  return (
      <div style={{display: "flex", flexDirection: "column"}}>
        <ExecuteQueryTab/>
        <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
        >
          <JsonCodeMirrorEditor payload={payload} setPayload={setPayload}/>
          <OutputRenderer response={response}/>
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
          {/* TODO: Enable Dry Run */}
          <Button sx={{margin: 2}} variant={'contained'} onClick={onRunHandler}
                  disabled={!payload.length}>
            Run
          </Button>
        </div>
      </div>
  );
};
