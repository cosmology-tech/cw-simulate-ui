import { Grid, Tabs, Tab } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import React from "react";

export const QueryResponseTab = () => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Tabs value="response" aria-label="Response Tab">
          <Tab value="response" label="Response" />
        </Tabs>
      </Grid>
    </Grid>
  );
};
