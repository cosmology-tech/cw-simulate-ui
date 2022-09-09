import { Tab, Tabs } from "@mui/material";
import React from "react";
import DiffSwitch from "./DiffSwitch";

interface IProps {
  currentTab: string;
  setCurrentTab: (val: string) => void;
  setIsChecked: (val: boolean) => void;
  isChecked: boolean;
  isStateTraversed: boolean;
}

const StateMemoryTab = ({
  currentTab,
  setCurrentTab,
  isChecked,
  setIsChecked,
  isStateTraversed,
}: IProps) => {
  const onChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
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
      <div style={{ display: "flex", marginLeft: 10 }}>
        <Tabs
          value={currentTab}
          onChange={onChangeHandler}
          aria-label="State/Memory Tab"
        >
          <Tab value="state" label="State" />
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

export default StateMemoryTab;
