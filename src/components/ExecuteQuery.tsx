import React from "react";
import { Config } from "../configs/config";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "./JsonCodeMirrorEditor";
import { useRecoilState, useRecoilValue } from "recoil";
import { snackbarNotificationState } from "../atoms/snackbarNotificationState";
import { executeQueryTabState } from "../atoms/executeQueryTabState";
import { Button, Grid, Typography } from "@mui/material";
import { payloadState } from "../atoms/payloadState";

interface IProps {
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
  setResponse,
  response,
  setAllStates,
  allStates,
  setCurrentState,
  currentState,
}: IProps) => {
  const {MOCK_ENV, MOCK_INFO} = Config;
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  const [payload, setPayload] = useRecoilState(payloadState);
  const executeQueryTab = useRecoilValue(executeQueryTabState);
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
        setSnackbarNotification({
          ...snackbarNotification,
          severity: "success",
          open: true,
          message: "Execution was successful!",
        });
      } else {
        throw res.read_json().error;
      }
    } catch (err) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: "error",
        open: true,
        message: "Something went wrong while executing.",
      });
    }
  };
  const query = () => {
    try {
      const stateBefore = window.VM?.backend?.storage.dict["c3RhdGU="];
      const res = window.VM.query(MOCK_ENV, JSON.parse(payload));
      setResponse(JSON.parse(window.atob(res.read_json().ok)));
      setSnackbarNotification({
        ...snackbarNotification,
        open: true,
        message: "Query was successful!",
      });
    } catch (err) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: "error",
        open: true,
        message: "Something went wrong while querying.",
      });
    }
  };
  const onRunHandler = () => {
    if (executeQueryTab === "execute") {
      execute();
    } else {
      query();
    }
  };
  React.useEffect(() => {
    if (currentState === allStates.length - 1) {
      setPayload("");
    }
  }, [executeQueryTab]);

  return (
    <Grid item xs={12} sx={{m: 2}}>
      <Grid item xs={12}>
        <ExecuteQueryTab/>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          textAlign: "left",
        }}
      >
        <JsonCodeMirrorEditor jsonValue={""}/>
        {/* <OutputRenderer response={response}/> */}
      </Grid>
      <Grid xs={1}>
        {/* TODO: Enable Dry Run */}
        <Button
          sx={{mt: 2}}
          variant={"contained"}
          onClick={onRunHandler}
          disabled={!payload.length}
        >
          <Typography variant="button">Run</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};
