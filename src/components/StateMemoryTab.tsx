import { Tabs } from "antd";
import React from "react";
const { TabPane } = Tabs;

interface IProps {
  currentTab: string;
  setCurrentTab: (val: string) => void;
}
const StateMemoryTab = ({ currentTab, setCurrentTab }: IProps) => {
  const onChange = (key: string) => {
    setCurrentTab(key);
  };
  return (
    <div style={{ display: "flex", marginLeft: 10 }}>
      <Tabs defaultActiveKey={currentTab} onChange={onChange}>
        <TabPane tab="State" key="state" />
        { (window.enableMemory)?<TabPane tab="Memory" key="memory" />:<div/> }
      </Tabs>
    </div>
  );
};

export default StateMemoryTab;
