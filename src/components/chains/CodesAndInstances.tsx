import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import T1Grid from "../T1Grid";
import InstantiateModal from "./InstantiateModal";

const CodesAndInstances = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "end"}}>
          <Button variant="contained" sx={{borderRadius: 2}}>
            <Typography variant="button">Upload Code</Typography>
          </Button>
        </Grid>
      </Grid>
      <T1Grid
        children={["Instance1", "Instance2"]}
        items={["Phoneix1", "Phoneix2"]}
        rightButton={
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{borderRadius: 2}}
          >
            <Typography variant="button">Instantiate</Typography>
          </Button>
        }
        hasRightDeleteButton={true}
      />
      <InstantiateModal open={open} setOpen={setOpen}/>
    </>
  );
};

export default CodesAndInstances;
