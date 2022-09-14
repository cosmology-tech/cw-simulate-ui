import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import T1Grid from "../T1Grid";

const Codes = () => {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Grid
          item
          xs={4}
          sx={{ display: "flex", justifyContent: "end", mr: 6 }}
        >
          <Button variant="contained" sx={{ borderRadius: 2 }}>
            <Typography variant="button">Upload Code</Typography>
          </Button>
        </Grid>
      </Grid>
      <T1Grid
        items={["Phoneix1", "Phoneix2"]}
        rightButton={
          <Button variant="contained" sx={{ borderRadius: 2 }}>
            <Typography variant="button">Instantiate</Typography>
          </Button>
        }
        hasRightDeleteButton={true}
      />
    </>
  );
};

export default Codes;
