import React, { useEffect, useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { Button, Grid } from "@mui/material";
import T1Container from "../grid/T1Container";
import useSimulation from "../../hooks/useSimulation";
import Divider from "@mui/material/Divider";
import T1JsonTree from "../T1JsonTree";
import CollapsibleWidget from "../CollapsibleWidget";
import { useAtomValue } from "jotai";
import { activeStepState } from "../../atoms/simulationPageAtoms";
import { getFormattedStep } from "./Executor";

interface IProps {
  contractAddress: string;
}

export default function QueryTab({contractAddress}: IProps) {
  const [response, setResponse] = useState("");
  const activeStep = useAtomValue(activeStepState);
  const onHandleQuery = (res: string) => {
    setResponse(res);
  };

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
      <CollapsibleWidget
        title={`Query @${getFormattedStep(activeStep)}`}
        height={280}
      >
        <Query
          contractAddress={contractAddress}
          onHandleQuery={onHandleQuery}
        />
      </CollapsibleWidget>
      <Divider sx={{my: 1}}/>
      <Grid item flex={1} position="relative">
        <T1Container>
          {response && <T1JsonTree data={response}/>}
        </T1Container>
      </Grid>
    </Grid>
  );
}

interface IQuery {
  contractAddress: string;
  onHandleQuery: (payload: string) => void;
}

function Query({contractAddress, onHandleQuery}: IQuery) {
  const sim = useSimulation();
  const setNotification = useNotification();
  const [payload, setPayload] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleQuery = async () => {
    try {
      const res = await sim.query(contractAddress, JSON.parse(payload));
      onHandleQuery(res.unwrap());
    } catch (err) {
      setNotification("Something went wrong while querying.", {
        severity: "error",
      });
      console.error(err);
    }
  };

  useEffect(() => {
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
            onChange={setPayload}
            onValidate={setIsValid}
          />
        </T1Container>
      </Grid>
      <Grid item container flexShrink={0}>
        <Button
          variant="contained"
          onClick={handleQuery}
          disabled={!payload.length || !isValid}
        >
          Run
        </Button>
      </Grid>
    </Grid>
  );
}
