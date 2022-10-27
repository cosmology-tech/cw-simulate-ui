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
import { useAtom, useAtomValue } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import T1Container from "../grid/T1Container";

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
  };

  const handleSetPayload = (val: string) => {
    setPayload(val);
  };

  React.useEffect(() => {
    setPayload("");
    setResponse(undefined);
  }, [executeQueryTab, contractAddress]);

  return (
    <Grid
      item
      container
      direction="column"
      flexWrap="nowrap"
      sx={{
        height: "100%",
        gap: 2,
      }}
    >
      <Grid item flexShrink={0}>
        <ExecuteQueryTab />
      </Grid>
      <Grid item flex={1} position="relative">
        <T1Container>
          <JsonCodeMirrorEditor
            jsonValue={payload}
            setPayload={handleSetPayload}
          />
        </T1Container>
      </Grid>
      <Grid
        item
        flexShrink={0}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          onClick={onRunHandler}
          disabled={!payload.length || jsonError.length > 0}
        >
          Run
        </Button>
      </Grid>
    </Grid>
  );
};
