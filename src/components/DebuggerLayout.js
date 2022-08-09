import {
  ReloadOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import "antd/dist/antd.min.css";
import "../index.css";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  // getItem('Option 1', '1', <PieChartOutlined />),
  // getItem('Option 2', '2', <DesktopOutlined />),
  // getItem('User', 'sub1', <UserOutlined />, [
  //   getItem('Tom', '3'),
  //   getItem('Bill', '4'),
  //   getItem('Alex', '5'),
  // ]),
  // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  // getItem('Files', '9', <FileOutlined />),
  getItem("Contract", "1", <CheckCircleOutlined />, [
    getItem("Instantsiate", "3", <PlayCircleOutlined />),
    getItem("Execute", "4", <DatabaseOutlined />),
    getItem("Query", "5", <SwapOutlined />),
  ]),
  getItem("Reset", "2", <ReloadOutlined />),
];

const DebuggerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            height:'6vh',
            marginBottom:'10px',
          }}

        />
        <Content
          style={{
            margin: "0 16px",
            height:'16vh'
          }}
        >
          {/* <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div
            className="site-layout-background"
            style={{
              padding: 34,
              height:'100%'
            }}
          >
            <FileUpload
              isFileUploaded={isFileUploaded}
              setIsFileUploaded={setIsFileUploaded}
            />
          </div>
        </Content>
         <Content
          className="site-layout-background"
          style={{
            margin: "12px 16px",
            padding: 24,
            minHeight: '18vh'
          }}
        >
          Blockchain state and other outputs will appear here
        </Content>
        <Content
          className="site-layout-background"
          style={{
            margin: "12px 16px",
            padding: 24,
            minHeight: '18vh',
            background:'rgb(16 15 15)',
            color:'white'
          }}
        >
          Console will be here. 
        </Content>
      </Layout>
    </Layout>
  );
};

export default DebuggerLayout;
