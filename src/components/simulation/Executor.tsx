import React, { useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { jsonErrorState } from "../../atoms/simulationPageAtoms";
import { Button, Grid } from "@mui/material";
import { useAtomValue } from "jotai";
import T1Container from "../grid/T1Container";
import useSimulation from "../../hooks/useSimulation";
import { useAccounts } from "../../CWSimulationBridge";

interface IProps {
  contractAddress: string;
}

export default function Executor({contractAddress}: IProps) {
  const sim = useSimulation();
  const setNotification = useNotification();
  
  // TODO: customize sender & funds
  const [sender, funds] = Object.entries(useAccounts(sim))[0] ?? [];
  
  const [payload, setPayload] = useState("");
  const jsonError = useAtomValue(jsonErrorState);
  
  const handleExecute = async () => {
    try {
      const res = await sim.execute(
        sender,
        contractAddress,
        JSON.parse(payload),
        funds,
      );
      res.unwrap();
    }
    catch (err) {
      setNotification("Something went wrong while executing.", {
        severity: "error",
      });
      console.error(err);
    }
  };

  React.useEffect(() => {
    setPayload("");
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
