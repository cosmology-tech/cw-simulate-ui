import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { validateConfigJSON } from "../../utils/fileUtils";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useAtomValue } from "jotai";
import T1Container from "../grid/T1Container";
import CwSimulateAppState from "../../atoms/cwSimulateAppState";

interface IConfigProps {
  chainId?: string | undefined
}

const Config = (props: IConfigProps) => {
  const chainId = useParams().chainId ?? props.chainId!;
  const {app} = useAtomValue(CwSimulateAppState);
  const jsonValue = JSON.stringify({chainId: app.chainId, bech32Prefix: app.bech32Prefix}, null, 2);
  const [jsonPayload, setJsonPayload] = useState("");
  const setNotification = useNotification();
  const navigate = useNavigate();

  const handleOnClick = (e: any) => {
    e.preventDefault();
    const json = jsonPayload !== "" ? JSON.parse(jsonPayload) : JSON.parse(jsonValue);
    if (!validateConfigJSON(json)) {
      setNotification("Invalid Config JSON", {severity: "error"});
      return;
    }

    if (json.chainId !== chainId) {
      navigate(`/chains/${json.chainId}/config`);
    }
    setNotification("Config updated successfully");
  };

  const handleSetPayload = (payload: string) => {
    setJsonPayload(payload);
  }

  return (
    <>
      <Typography variant="h4">{chainId}</Typography>
      <Typography variant="h6">Configuration</Typography>
      <Grid
        item
        flex={1}
      >
        <T1Container>
          <JsonCodeMirrorEditor jsonValue={jsonValue} setPayload={handleSetPayload}/>
        </T1Container>
      </Grid>
      <Grid
        item
        container
        justifyContent="flex-end"
        sx={{mt: 2}}
      >
        <Button variant="contained" sx={{borderRadius: 2}} onClick={handleOnClick}>
          <Typography variant="button">Update Configuration</Typography>
        </Button>
      </Grid>
    </>
  );
};

export default Config;
