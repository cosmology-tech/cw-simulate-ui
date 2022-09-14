import { Button, Grid, Typography } from "@mui/material";
import T1Grid from "../T1Grid";

const Instances = () => {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Grid
          item
          xs={4}
          sx={{ display: "flex", justifyContent: "end", mr: 6 }}
        >
          <Button variant="contained" sx={{ borderRadius: 2 }}>
            <Typography variant="button">New Instance</Typography>
          </Button>
        </Grid>
      </Grid>
      <T1Grid items={["Instance1", "Instance2"]} rightButton={true} />
    </>
  );
};

export default Instances;
