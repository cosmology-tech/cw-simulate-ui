import { Button, Grid, Typography } from "@mui/material";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";

const Config = () => {
  return (
    <>
      <Typography variant="h6">Configuration</Typography>
      <JsonCodeMirrorEditor/>
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
