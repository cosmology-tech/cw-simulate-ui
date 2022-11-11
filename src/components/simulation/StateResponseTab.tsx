import { Grid, Tab, Tabs } from "@mui/material";
import React from "react";

interface IProps {
  currentTab: string;
  setCurrentTab: (val: "summary" | "response" | "logs") => void;
}

const StateResponseTab = ({currentTab, setCurrentTab}: IProps) => {
  const onChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(
      newValue === "summary"
        ? "summary"
        : newValue === "response"
          ? "response"
          : newValue === "logs"
            ? "logs"
            : "logs"
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
          <Tab value="summary" label="Summary"/>
          <Tab value="response" label="Response"/>
          <Tab value="logs" label="Logs"/>
        </Tabs>
      </Grid>
    </Grid>
  );
};

export default StateResponseTab;
