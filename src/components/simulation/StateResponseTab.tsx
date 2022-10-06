import { Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import DiffSwitch from "./DiffSwitch";

interface IProps {
  currentTab: string;
  setCurrentTab: (val: "response" | "state") => void;
  setIsChecked: (val: boolean) => void;
  isChecked: boolean;
  isStateTraversed: boolean;
}

const StateResponseTab = ({
  currentTab,
  setCurrentTab,
  isChecked,
  setIsChecked,
  isStateTraversed,
}: IProps) => {
  const onChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue === "response" ? "response" : "state");
  };
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item container>
        <Tabs
          value={currentTab}
          onChange={onChangeHandler}
          aria-label="State & Response tabs"
        >
          <Tab value="state" label="State"/>
          <Tab value="response" label="Response"/>
          {/* <Tab value="memory" label="Memory" /> */}
        </Tabs>
      </Grid>
      {isStateTraversed && (
        <Grid item>
          <DiffSwitch isChecked={isChecked} setIsChecked={setIsChecked}/>
        </Grid>
      )}
    </Grid>
  );
};

export default StateResponseTab;
