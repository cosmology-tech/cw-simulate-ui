import { Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import CloseDiff from "./CloseDiff";

interface IProps {
  currentTab: string;
  setCurrentTab: (val: "response" | "state" | "request") => void;
  setIsVisible: (val: boolean) => void;
  isVisible: boolean;
}

const StateResponseTab = ({
  currentTab,
  setCurrentTab,
  isVisible,
  setIsVisible,
}: IProps) => {
  const onChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(
      newValue === "response"
        ? "response"
        : newValue === "request"
        ? "request"
        : "state"
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
          <Tab value="state" label="State" />
          <Tab value="request" label="Request" />
          <Tab value="response" label="Response" />
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

export default StateResponseTab;
