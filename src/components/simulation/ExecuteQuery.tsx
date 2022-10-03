import React, { useState } from "react";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { executeQueryTabState } from "../../atoms/executeQueryTabState";
import { Button, Grid, Typography } from "@mui/material";
import { jsonErrorState } from "../../atoms/jsonErrorState";
import { useExecute, useQuery } from "../../utils/simulationUtils";
import { MsgInfo } from "@terran-one/cw-simulate";
import { SENDER_ADDRESS } from "../../configs/variables";
import { useAtomValue } from "jotai";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";
import { useAtom } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";

interface IProps {
  setResponse: (val: JSON | undefined) => void;
  chainId: string;
  contractAddress: string;
}

export const ExecuteQuery = ({
  setResponse,
  chainId,
  contractAddress,
}: IProps) => {
  const [payload, setPayload] = useState("");
  const executeQueryTab = useAtomValue(executeQueryTabState);
  const [currentState, setCurrentState] = useAtom(currentStateNumber);
  const [stateResponseTab, setStateResponseTab] = useAtom(
    stateResponseTabState
  );
  const jsonError = useAtomValue(jsonErrorState);
  const setNotification = useNotification();
  const execute = useExecute();
  const query = useQuery();
  const info: MsgInfo = {
    sender: SENDER_ADDRESS,
    funds: [],
  };

  const handleExecute = () => {
    try {
      const res: any = execute(
        chainId,
        contractAddress,
        info,
        JSON.parse(payload)
      );
      setResponse(res);
      setNotification("Execute was successful!");
      setCurrentState(currentState + 1);
    } catch (err) {
      setNotification("Something went wrong while executing.", {
        severity: "error",
      });
      console.log(err);
    }
  };
  const handleQuery = () => {
    try {
      const res: any = query(chainId, contractAddress, JSON.parse(payload));
      setResponse(JSON.parse(window.atob(res.ok)));
      setNotification("Query was successful!");
    } catch (err) {
      setNotification("Something went wrong while querying.", {
        severity: "error",
      });
    }
  };
  const onRunHandler = () => {
    if (executeQueryTab === "execute") {
      handleExecute();
    } else {
      handleQuery();
    }
    setStateResponseTab("response");
  };

  const handleSetPayload = (val: string) => {
    setPayload(val);
  };

  React.useEffect(() => {
    setPayload("");
  }, [executeQueryTab]);

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
        <JsonCodeMirrorEditor
          jsonValue={payload}
          setPayload={handleSetPayload}
        />
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
