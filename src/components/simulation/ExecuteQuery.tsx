import React, { useState } from "react";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import {
  activeStepState,
  executeQueryTabState,
  jsonErrorState,
  updateStepperState,
} from "../../atoms/simulationPageAtoms";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import T1Container from "../grid/T1Container";
import {
  getAddressAndFunds,
  useExecute,
  useQuery,
} from "../../utils/simulationUtils";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";

interface IProps {
  setResponse: (val: JSON | undefined) => void;
  contractAddress: string;
}

export const ExecuteQuery = ({ setResponse, contractAddress }: IProps) => {
  const [payload, setPayload] = useState("");
  const executeQueryTab = useAtomValue(executeQueryTabState);
  const [updateStepper, setUpdateStepper] = useAtom(updateStepperState);
  const activeStep = useAtomValue(activeStepState);
  const jsonError = useAtomValue(jsonErrorState);
  const { app } = useAtomValue(cwSimulateAppState);
  const addressAndFunds = getAddressAndFunds(app.chainId);
  const setNotification = useNotification();
  const execute = useExecute();
  const query = useQuery();
  const getFormattedStep = (step: string) => {
    const activeStepArr = step.split("-");
    let formattedStep = "";
    for (let i = 0; i < activeStepArr.length - 1; i++) {
      formattedStep += `${Number(activeStepArr[i]) + 1}.`;
    }
    return formattedStep.slice(0, formattedStep.length - 1);
  };
  const handleExecute = async () => {
    try {
      const res: any = await execute(
        addressAndFunds.address,
        addressAndFunds.funds,
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
    setUpdateStepper(updateStepper + 1);
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
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={onRunHandler}
          disabled={!payload.length || jsonError.length > 0}
        >
          Run
        </Button>
        <Chip
          label={
            <Typography variant="caption">
              Current Active Step : {getFormattedStep(activeStep)}
            </Typography>
          }
        />
      </Grid>
    </Grid>
  );
};
