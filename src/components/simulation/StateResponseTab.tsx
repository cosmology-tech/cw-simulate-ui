import { Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import DiffSwitch from "./DiffSwitch";

interface IProps {
  currentTab: string;
  setCurrentTab: (val: "response" | "state") => void;
  setIsChecked: (val: boolean) => void;
  isChecked: boolean;
}

const StateResponseTab = ({
  currentTab,
  setCurrentTab,
  isChecked,
  setIsChecked,
}: IProps) => {
  const onChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue === "response" ? "response" : "state");
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Tabs
          value={currentTab}
          onChange={onChangeHandler}
          aria-label="State & Response tabs"
        >
          <Tab value="state" label="State" />
          <Tab value="response" label="Response" />
          {/* <Tab value="memory" label="Memory" /> */}
        </Tabs>
      </Grid>
      {isChecked && (
        <Grid item>
          <DiffSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
        </Grid>
      )}
    </Grid>
  );
};

export default StateResponseTab;
