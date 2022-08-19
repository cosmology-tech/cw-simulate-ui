import { Tabs } from "antd";
import React from "react";
const { TabPane } = Tabs;

interface IProps {
  currentTab: string;
  setCurrentTab: (val: string) => void;
}
const ExecuteQueryTab = ({ currentTab, setCurrentTab }: IProps) => {
  const onChange = (key: string) => {
    setCurrentTab(key);
  };
  return (
    <div style={{ display: "flex", marginLeft: 10 }}>
      <Tabs defaultActiveKey={currentTab} onChange={onChange}>
        <TabPane tab="Execute" key="execute" />
        <TabPane tab="Query" key="query" />
      </Tabs>
    </div>
  );
};

export default ExecuteQueryTab;
