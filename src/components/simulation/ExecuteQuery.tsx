import React, { useState } from "react";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { executeQueryTabState } from "../../atoms/executeQueryTabState";
import { Button, Grid } from "@mui/material";
import { jsonErrorState } from "../../atoms/jsonErrorState";
import { SENDER_ADDRESS } from "../../configs/variables";
import { useAtom, useAtomValue } from "jotai";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import T1Container from "../grid/T1Container";
import { useExecute, useQuery } from "../../utils/simulationUtils";

interface IProps {
  setResponse: (val: JSON | undefined) => void;
  contractAddress: string;
}

export const ExecuteQuery = ({ setResponse, contractAddress }: IProps) => {
  const [payload, setPayload] = useState("");
  const executeQueryTab = useAtomValue(executeQueryTabState);
  const [currentState, setCurrentState] = useAtom(currentStateNumber);
  const jsonError = useAtomValue(jsonErrorState);
  const setNotification = useNotification();
  const execute = useExecute();
  const query = useQuery();

  const handleExecute = async () => {
    try {
      const res: any = await execute(
        SENDER_ADDRESS,
        [],
        contractAddress,
        JSON.parse(payload)
      );
      const response = res.err
        ? ({ error: res.val } as unknown as JSON)
        : (res.unwrap() as JSON);
      setResponse(response);
      if (res.err) {
        throw new Error(res.err);
      }
      setNotification("Execute was successful!");
    } catch (err) {
      setNotification("Something went wrong while executing.", {
        severity: "error",
      });
      console.log(err);
    }
    setCurrentState(currentState + 1);
  };
  const handleQuery = async () => {
    try {
      const res: any = await query(contractAddress, JSON.parse(payload));
      setResponse(res.unwrap() as JSON);
      setNotification("Query was successful!");
    } catch (err) {
      setNotification("Something went wrong while querying.", {
        severity: "error",
      });
    }
  };
  const onRunHandler = async () => {
    if (executeQueryTab === "execute") {
      await handleExecute();
    } else {
      await handleQuery();
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
