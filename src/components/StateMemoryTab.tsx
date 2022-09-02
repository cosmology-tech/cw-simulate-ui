import { Tabs } from "antd";
import React from "react";
import DiffSwitch from "./DiffSwitch";
const { TabPane } = Tabs;

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
  const onChange = (key: string) => {
    setCurrentTab(key);
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
        <Tabs defaultActiveKey={currentTab} onChange={onChange}>
          <TabPane tab="State" key="state" />
          {/* <TabPane tab="Memory" key="memory" /> */}
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
