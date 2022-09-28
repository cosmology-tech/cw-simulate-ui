import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useNotification } from "../../atoms/snackbarNotificationState";
import filteredConfigsByChainId from "../../selectors/filteredConfigsByChainId";
import { validateConfigJSON } from "../../utils/fileUtils";
import { useReconfigChainForSimulation } from "../../utils/setupSimulation";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";

interface IConfigProps {
  chainId?: string|undefined
}

const Config = (props: IConfigProps) => {
  const chainId = useParams().chainId ?? props.chainId!
  const configValue = useRecoilValue(filteredConfigsByChainId(chainId));
  const jsonValue = JSON.stringify(configValue, null, 2);
  const [jsonPayload, setJsonPayload] = useState("");
  const reconfigChain = useReconfigChainForSimulation();
  const setNotification = useNotification();
  const navigate = useNavigate();

  const handleOnClick = (e: any) => {
    e.preventDefault();
    const json = jsonPayload !== "" ? JSON.parse(jsonPayload) : JSON.parse(jsonValue);
    if (!validateConfigJSON(json)) {
      setNotification("Invalid Config JSON", { severity: "error" });
      return;
    }

    reconfigChain(configValue.chainId, json);
    if (json.chainId !== chainId) {
      navigate(`/chains/${json.chainId}`);
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
      <JsonCodeMirrorEditor jsonValue={jsonValue} setPayload={handleSetPayload}/>
      <Grid
        item
        xs={12}
        sx={{display: "flex", justifyContent: "end", marginTop: 2}}
      >
        <Button variant="contained" sx={{borderRadius: 2}} onClick={handleOnClick}>
          <Typography variant="button">Update Configuration</Typography>
        </Button>
      </Grid>
    </>
  );
};

export default Config;
