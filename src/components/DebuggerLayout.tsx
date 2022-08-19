import {
  ReloadOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {Layout, Menu } from "antd";
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import "antd/dist/antd.min.css";
import "../index.css";
import { Config } from "../config";
import { message } from "antd";
import { getItem } from "utils";
import { StateRenderer } from "./StateRenderer";
import { ExecuteQuery } from "./ExecuteQuery";
import {ConsoleRenderer} from "./ConsoleRenderer";

const { Header, Content, Sider } = Layout;
enum MENU_KEYS {
  INSTANTIATE = "instantiate",
  CONTRACT = "contract",
  EXECUTE = "execute",
  QUERY = "query",
  RESET = "reset",
}

const DebuggerLayout = () => {
  global.window.Buffer = global.window.Buffer || require("buffer").Buffer;
  const [collapsed, setCollapsed] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const [wasmBuffer, setWasmBuffer] = React.useState<ArrayBuffer | null>(null);
  const [payload, setPayload] = React.useState("");
  const { MOCK_ENV, MOCK_INFO } = Config;
  const items = [
    getItem(
      "Contract",
      MENU_KEYS.CONTRACT,
      <CheckCircleOutlined />,
      [
        getItem("Instantiate", MENU_KEYS.INSTANTIATE, <PlayCircleOutlined />),
      ],
      !isFileUploaded
    ),
    getItem("Reset", MENU_KEYS.RESET, <ReloadOutlined />),
  ];
  const onItemSelectHandler = (menuKey: string) => {
    if (menuKey === MENU_KEYS.INSTANTIATE) {
      try {
        const res = window.VM.instantiate(MOCK_ENV, MOCK_INFO, { count: 20 });
        message.success("CosmWasm VM successfully instantiated!");
        window.Console.log("*********", res);
      } catch (err) {
        message.error(
          "CosmWasm VM was not able to instantiate. Please check console for errors."
        );
        window.Console.log(err);
      }
    } 
    else if (menuKey === MENU_KEYS.RESET) {
      setIsFileUploaded(false);
      setWasmBuffer(null);
      setPayload("");
    }
  };
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
        {isFileUploaded ? (
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            onSelect={(menuItem) => onItemSelectHandler(menuItem.key)}
          />
        ) : (
          "Menu will appear here"
        )}
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            height: "6vh",
            marginBottom: "10px",
          }}
        />
        <Content
          style={{
            margin: "0 16px",
            height: "auto",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 10,
              height: "100%",
            }}
          >
            {!isFileUploaded ? (
              <FileUpload
                setIsFileUploaded={setIsFileUploaded}
                setWasmBuffer={setWasmBuffer}
              />
            ) : (
               <ExecuteQuery payload={payload} setPayload={setPayload}/>
            )}
          </div>
        </Content>
        <Content
          className="site-layout-background"
          style={{
            margin: "12px 16px",
            padding: 24,
            minHeight: "30vh",
          }}
        >
          <StateRenderer isFileUploaded={isFileUploaded} />
        </Content>
        <Content
          className="site-layout-background"
          style={{
            margin: "12px 16px",
            padding: 24,
            minHeight: "18vh",
            maxHeight:'24vh',
            background: "rgb(16 15 15)",
            color: "white",
            overflow:"scroll"
          }}
        >
          <ConsoleRenderer logs={window.Console.logs}></ConsoleRenderer>
        </Content>
       
      </Layout>
    </Layout>
  );
};

export default DebuggerLayout;
