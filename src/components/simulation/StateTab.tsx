import { Grid, Tabs, Tab } from "@mui/material";
import React from "react";
import CloseDiff from "./CloseDiff";

interface IProps {
  setIsVisible: (val: boolean) => void;
  isVisible: boolean;
}

export const StateTab = ({ isVisible, setIsVisible }: IProps) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Tabs value="state" aria-label="State Tab">
          <Tab value="state" label="State" />
        </Tabs>
      </Grid>
      {isVisible && (
        <Grid item>
          <CloseDiff isVisible={isVisible} setIsVisible={setIsVisible} />
        </Grid>
      )}
    </Grid>
  );
};
