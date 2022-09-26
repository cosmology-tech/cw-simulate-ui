import React, { useState } from "react";
import { Config } from "../configs/config";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "./JsonCodeMirrorEditor";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNotification } from "../atoms/snackbarNotificationState";
import { executeQueryTabState } from "../atoms/executeQueryTabState";
import { Button, Grid, Typography } from "@mui/material";
import { jsonErrorState } from "../atoms/jsonErrorState";

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
  const { MOCK_ENV, MOCK_INFO } = Config;
  const [payload, setPayload] = useState("");
  const executeQueryTab = useRecoilValue(executeQueryTabState);
  const jsonError = useRecoilValue(jsonErrorState);
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

  const setNotification = useNotification();

  const execute = () => {
    try {
      // TODO: window.CWEnv.chains['untitled-1'].contracts['terra13hkgfq43gch3hr8a23gm3rfcj44wyvp75h3rk7'].execute
      const stateBefore = window.VM?.backend?.storage.dict["c3RhdGU="];
      const res = window.VM.execute(MOCK_ENV, MOCK_INFO, JSON.parse(payload));
      setResponse(res.read_json());
      if (!(res.read_json().error && res.read_json().error.length > 0)) {
        addState(stateBefore, res);
        setNotification("Execution was successful!");
      } else {
        throw res.read_json().error;
      }
    } catch (err) {
      setNotification("Something went wrong while executing.", {
        severity: "error",
      });
    }
  };
  const query = () => {
    try {
      const stateBefore = window.VM?.backend?.storage.dict["c3RhdGU="];
      const res = window.VM.query(MOCK_ENV, JSON.parse(payload));
      setResponse(JSON.parse(window.atob(res.read_json().ok)));
      setNotification("Query was successful!");
    } catch (err) {
      setNotification("Something went wrong while querying.", {
        severity: "error",
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

  const handleSetPayload = (val: string) => {
    setPayload(val);
  };

  return (
    <Grid item xs={12} sx={{ height: "100%", overflow: "scroll" }}>
      <Grid item xs={12}>
        <ExecuteQueryTab />
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          textAlign: "left",
          height: "60%",
          mt: 2,
        }}
      >
        <JsonCodeMirrorEditor jsonValue={""} setPayload={handleSetPayload} />
        {/* <OutputRenderer response={response}/> */}
      </Grid>
      <Grid
        item
        xs={2}
        sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}
      >
        {/* TODO: Enable Dry Run */}
        <Button
          sx={{ mt: 2 }}
          variant={"contained"}
          onClick={onRunHandler}
          disabled={!payload.length || jsonError.length > 0}
        >
          <Typography variant="button">Run</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};
