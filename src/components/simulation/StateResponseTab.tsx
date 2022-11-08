import { Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import CloseDiff from "./CloseDiff";

interface IProps {
  currentTab: string;
  setCurrentTab: (val: "response" | "request" | "trace" | "debug") => void;
}

const StateResponseTab = ({ currentTab, setCurrentTab }: IProps) => {
  const onChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(
      newValue === "response"
        ? "response"
        : newValue === "request"
        ? "request"
        : newValue === "trace"
        ? "trace"
        : "debug"
    );
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Tabs
          value={currentTab}
          onChange={onChangeHandler}
          aria-label="State & Response tabs"
        >
          <Tab value="request" label="Request" />
          <Tab value="response" label="Response" />
          <Tab value="trace" label="Trace" />
          <Tab value="debug" label="Debug" />
        </Tabs>
      </Grid>
    </Grid>
  );
};

export default StateResponseTab;
