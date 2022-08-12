import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';
import {
  DatabaseOutlined,
  SwapOutlined,
  ForkOutlined
} from "@ant-design/icons";

const items = [
  {
    label: 'Execute Output',
    key: 'execute',
    icon: <DatabaseOutlined />,
  },
  {
    label: 'Query Ouput',
    key: 'query',
    icon: <SwapOutlined />,
  },
  {
    label: 'Current State',
    key: 'state',
    icon: <ForkOutlined />,
  }
];
interface IProps {
  currentTab:string;
  setCurrentTab:(val:string)=>void
}
const TopNavigation = ({currentTab, setCurrentTab}:IProps) => {
  const onClick = (e: { key:string; }) => {
    console.log('click ', e);
    setCurrentTab(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[currentTab]} mode="horizontal" items={items} />;
};

export default TopNavigation;