import { Button, Grid, Typography } from "@mui/material";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useRecoilValue } from "recoil";
import filteredChainsFromSimulationState from "../../selectors/filteredConfigsFromSimulationState";
import { useParams } from "react-router-dom";

const Config = () => {
  const configValue = useRecoilValue(filteredChainsFromSimulationState);
  const param = useParams();
  const jsonValue = JSON.stringify(configValue.filter((config: any) => config.chainId === param.id)[0], null, 2);
  return (
    <>
      <Typography variant="h6">Configuration</Typography>
      <JsonCodeMirrorEditor jsonValue={jsonValue}/>
      <Grid
        item
        xs={12}
        sx={{display: "flex", justifyContent: "end", marginTop: 2}}
      >
        <Button variant="contained" sx={{borderRadius: 2}}>
          <Typography variant="button">Update Configuration</Typography>
        </Button>
      </Grid>
    </>
  );
};

export default Config;
