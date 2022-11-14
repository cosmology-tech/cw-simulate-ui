import React, { useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import {
  currentStateNumber,
  jsonErrorState,
  responseState,
} from "../../atoms/simulationPageAtoms";
import { Button, Grid } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import T1Container from "../grid/T1Container";
import { getAddressAndFunds, useExecute } from "../../utils/simulationUtils";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";

interface IProps {
  contractAddress: string;
}

export default function Executor({contractAddress}: IProps) {
  const [payload, setPayload] = useState("");
  const [currentState, setCurrentState] = useAtom(currentStateNumber);
  const jsonError = useAtomValue(jsonErrorState);
  const {app} = useAtomValue(cwSimulateAppState);
  const addressAndFunds = getAddressAndFunds(app.chainId);
  const setNotification = useNotification();
  const setResponse = useSetAtom(responseState);
  const execute = useExecute();
  
  const handleExecute = async () => {
    try {
      const res: any = await execute(
        addressAndFunds.address,
        addressAndFunds.funds,
        contractAddress,
        JSON.parse(payload)
      );
      const response = res.err
        ? ({error: res.val} as unknown as JSON)
        : (res.unwrap() as JSON);
      setResponse(response);
      if (res.err) {
        throw new Error(res.err);
      }
    } catch (err) {
      setNotification("Something went wrong while executing.", {
        severity: "error",
      });
      console.error(err);
    }
    setCurrentState(currentState + 1);
  };

  React.useEffect(() => {
    setPayload("");
    setResponse(undefined);
  }, [contractAddress]);

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
      <Grid item flex={1} position="relative">
        <T1Container>
          <JsonCodeMirrorEditor
            jsonValue={payload}
            setPayload={setPayload}
          />
        </T1Container>
      </Grid>
      <Grid item container flexShrink={0}>
        <Button
          variant="contained"
          onClick={handleExecute}
          disabled={!payload.length || jsonError.length > 0}
        >
          Run
        </Button>
      </Grid>
    </Grid>
  );
};
