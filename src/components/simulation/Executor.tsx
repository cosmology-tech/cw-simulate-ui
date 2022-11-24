import React, { useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import T1Container from "../grid/T1Container";
import useSimulation from "../../hooks/useSimulation";
import { useAccounts } from "../../CWSimulationBridge";
import { activeStepState } from "../../atoms/simulationPageAtoms";
import { BeautifyJSON } from "./tabs/Common";
import CollapsibleWidget from "../CollapsibleWidget";

interface IProps {
  contractAddress: string;
}
export const getFormattedStep = (step: string) => {
  const activeStepArr = step.split("-").map((ele) => Number(ele) + 1);
  let formattedStep = activeStepArr
    .slice(0, activeStepArr.length - 1)
    .join(".");
  return formattedStep;
};

export default function Executor({ contractAddress }: IProps) {
  const sim = useSimulation();
  const setNotification = useNotification();
  const [payload, setPayload] = useState("");
  const [isValid, setIsValid] = useState(true);
  // TODO: customize sender & funds
  const [sender, funds] = Object.entries(useAccounts(sim))[0] ?? [];
  const activeStep = useAtomValue(activeStepState);

  const handleExecute = async () => {
    try {
      const res = await sim.execute(
        sender,
        contractAddress,
        JSON.parse(payload),
        funds
      );
      res.unwrap();
    } catch (err) {
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
    <CollapsibleWidget
      title={"Execute"}
      height={280}
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
        <Grid item container flexShrink={0} justifyContent="space-between">
          <Grid item>
            <Button
              variant="contained"
              onClick={handleExecute}
              disabled={!payload.length || !isValid}
            >
              Run
            </Button>
          </Grid>
          <Chip
            label={
              <Typography variant="caption">
                Current Active Step : {getFormattedStep(activeStep)}
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </CollapsibleWidget>
  );
}
