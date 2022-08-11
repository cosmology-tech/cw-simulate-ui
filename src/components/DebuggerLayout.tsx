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
import ReactObjectTableViewer from "react-object-table-viewer";

const { Header, Content, Sider } = Layout;

function getItem(label: string, key: string, icon: JSX.Element, children?: { key: any; icon: any; children: any; label: any; }[]) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
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
  const [wasmBuffer, setWasmBuffer] = React.useState<string | ArrayBuffer | null>(null);
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
          <div
            className="site-layout-background"
            style={{
              padding: 34,
              height:'100%'
            }}
          >
            {!isFileUploaded && <FileUpload
              setIsFileUploaded={setIsFileUploaded}
              setWasmBuffer={setWasmBuffer}
            />}
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
          {/* @ts-ignore */}
          <ReactObjectTableViewer data={window.vm?.store}></ReactObjectTableViewer>
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
