import { Tab, Tabs } from "@mui/material";
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex" }}>
        <Tabs
          value={currentTab}
          onChange={onChangeHandler}
          aria-label="State/Response"
        >
          <Tab value="state" label="State" />
          <Tab value="response" label="Response" />
          {/* <Tab value="memory" label="Memory" /> */}
        </Tabs>
      </div>
      {isStateTraversed && (
        <div>
          <DiffSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
        </div>
      )}
    </div>
  );
};

export default StateResponseTab;
