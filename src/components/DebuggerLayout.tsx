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
import { Config } from "../config";
import { message } from "antd";
import TextBox from "./TextBox";
import { getItem } from "utils";
import ReactObjectTableViewer from "react-object-table-viewer";
import { OutputRenderer } from "./OutputRenderer";
import {ConsoletRenderer} from "./ConsoleRenderer";

const { Header, Content, Sider } = Layout;
enum MENU_KEYS {
  INSTANTIATE = "instantiate",
  CONTRACT = "contract",
  EXECUTE = "execute",
  QUERY = "query",
  RESET = "reset",
}

const data = {
  hello: "world",
  abc: 123,
  array: ["1", "2", "3"],
};
const DebuggerLayout = () => {
  window.Buffer = window.Buffer || require("buffer").Buffer;
  const logs: string[] = [];
  const [collapsed, setCollapsed] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const [wasmBuffer, setWasmBuffer] = React.useState<ArrayBuffer | null>(null);
  const [payload, setPayload] = React.useState("");
  const [queryResponse, setQueryResponse] = React.useState<JSON | undefined>();
  const [executeResponse, setExecuteResponse] = React.useState<
    JSON | undefined
  >();
  
const consolelog = function() { for(let message in parameters) { logs.push(message); } };

  const { MOCK_ENV, MOCK_INFO } = Config;
  const items = [
    getItem(
      "Contract",
      MENU_KEYS.CONTRACT,
      <CheckCircleOutlined />,
      [
        getItem("Instantiate", MENU_KEYS.INSTANTIATE, <PlayCircleOutlined />),
        getItem("Execute", MENU_KEYS.EXECUTE, <DatabaseOutlined />),
        getItem("Query", MENU_KEYS.QUERY, <SwapOutlined />),
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
        consolelog("*********", res);
      } catch (err) {
        message.error(
          "CosmWasm VM was not able to instantiate. Please check console for errors."
        );
        consolelog(err);
      }
    } else if (menuKey === MENU_KEYS.EXECUTE) {
      try {
       const res = window.VM.execute(MOCK_ENV, MOCK_INFO, JSON.parse(payload));
       setExecuteResponse(res.read_json());
       consolelog("Execute", res.read_json());
       message.success('Execution was successfull! Check Execute Output for Output.');
      }
      catch(err) {
        message.error('Something went wrong while executing.')
      }
     
    } else if (menuKey === MENU_KEYS.QUERY) {
      try {
      const res = window.VM.query(MOCK_ENV, JSON.parse(payload));
      setQueryResponse(JSON.parse(window.atob(res.read_json().ok)));
      consolelog("Query ", res.read_json());
      message.success('Query was successfull! Check Query Output for Output.');
      }
      catch(err) {
         message.error('Something went wrong while querying.')
      }
    } else if (menuKey === MENU_KEYS.RESET) {
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
            height: "16vh",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 34,
              height: "100%",
            }}
          >
            {!isFileUploaded ? (
              <FileUpload
                setIsFileUploaded={setIsFileUploaded}
                setWasmBuffer={setWasmBuffer}
              />
            ) : (
              <TextBox payload={payload} setPayload={setPayload} />
            )}
          </div>
        </Content>
        <Content
          className="site-layout-background"
          style={{
            margin: "12px 16px",
            padding: 24,
            minHeight: "18vh",
          }}
        >
          {/* @ts-ignore */}
          {/* <ReactObjectTableViewer
            data={window.VM?.store}
          ></ReactObjectTableViewer> */}
          <OutputRenderer queryResponse={queryResponse} executeResponse={executeResponse} isFileUploaded={isFileUploaded} />
        </Content>
        <Content
          className="site-layout-background"
          style={{
            margin: "12px 16px",
            padding: 24,
            minHeight: "18vh",
            background: "rgb(16 15 15)",
            color: "white",
          }}
        >
          <ConsoletRenderer logs={logs}></ConsoletRenderer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DebuggerLayout;
