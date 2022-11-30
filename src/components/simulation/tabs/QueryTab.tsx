import React, { useEffect, useState } from "react";
import { JsonCodeMirrorEditor } from "../../JsonCodeMirrorEditor";
import { useNotification } from "../../../atoms/snackbarNotificationState";
import { Button, Grid } from "@mui/material";
import T1Container from "../../grid/T1Container";
import useSimulation from "../../../hooks/useSimulation";
import Divider from "@mui/material/Divider";
import T1JsonTree from "../../T1JsonTree";
import CollapsibleWidget from "../../CollapsibleWidget";
import { useAtomValue } from "jotai";
import { activeStepState } from "../../../atoms/simulationPageAtoms";
import { getFormattedStep } from "../Executor";
import { Result } from "ts-results/result";
import { BeautifyJSON, EmptyTab, TabHeader } from "./Common";
import BlockQuote from "../../BlockQuote";

interface IProps {
  contractAddress: string;
}

export default function QueryTab({ contractAddress }: IProps) {
  const [response, setResponse] = useState<Result<any, string>>();
  const onHandleQuery = (res: Result<any, string>) => {
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
      <Query contractAddress={contractAddress} onHandleQuery={onHandleQuery} />

      <Divider sx={{ my: 1 }} />
      <Grid item flex={1} position="relative">
        <T1Container>
          {response?.err ? (
            <>
              <TabHeader>Query Error</TabHeader>
              <BlockQuote>{response.val}</BlockQuote>
            </>
          ) : response ? (
            <T1JsonTree data={response?.val} />
          ) : (
            <EmptyTab>Your query output will appear here</EmptyTab>
          )}
        </T1Container>
      </Grid>
    </Grid>
  );
}

interface IQuery {
  contractAddress: string;
  onHandleQuery: (payload: Result<any, string>) => void;
}

function Query({ contractAddress, onHandleQuery }: IQuery) {
  const sim = useSimulation();
  const setNotification = useNotification();
  const activeStep = useAtomValue(activeStepState);
  const [payload, setPayload] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleQuery = async () => {
    try {
      const res = await sim.query(
        contractAddress,
        JSON.parse(payload),
        activeStep
      );
      onHandleQuery(res);
      if (res.err) {
        throw new Error("Something went wrong while querying.");
      }
    } catch (err: any) {
      setNotification(err.message, {
        severity: "error",
      });
    }
  };

  useEffect(() => {
    setPayload("");
  }, [contractAddress]);
  return (
    <CollapsibleWidget
      title={`Query @${getFormattedStep(activeStep)}`}
      height={280}
      collapsible={false}
      right={
        <BeautifyJSON
          onChange={setPayload}
          disabled={!payload.length || !isValid}
        />
      }
    >
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
    </CollapsibleWidget>
  );
}
