import React, { useCallback, useState } from "react";
import { Config } from "../../configs/config";
import ExecuteQueryTab from "./ExecuteQueryTab";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useRecoilValue } from "recoil";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { executeQueryTabState } from "../../atoms/executeQueryTabState";
import { Button, Grid, Typography } from "@mui/material";
import { jsonErrorState } from "../../atoms/jsonErrorState";
import { useExecute, useQuery } from "../../utils/setupSimulation";
import { MsgInfo } from "@terran-one/cw-simulate";

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
  const { MOCK_ENV, MOCK_INFO } = Config;
  const [payload, setPayload] = useState("");
  const executeQueryTab = useRecoilValue(executeQueryTabState);
  const jsonError = useRecoilValue(jsonErrorState);
  const setNotification = useNotification();
  const execute = useExecute();
  const query = useQuery();
  const info: MsgInfo = {
    sender: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
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
