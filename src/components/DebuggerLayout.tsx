import { CheckCircleOutlined, ReloadOutlined, } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import "antd/dist/antd.min.css";
import "../index.css";
import { Config } from "../configs/config";
import { getItem } from "../utils";
import { StateRenderer } from "./StateRenderer";
import { ExecuteQuery, IState } from "./ExecuteQuery";
import { ConsoleRenderer } from "./ConsoleRenderer";
import { StateTraversal } from "./StateTraversal";
import { Instantiate } from "./Instantiate";
import SnackbarNotification from "./SnackbarNotification";
import { useRecoilState } from "recoil";
import { executeQueryTabAtom } from "../atoms/executeQueryTabAtom";
import { snackbarNotificationAtom } from "../atoms/snackbarNotificationAtom";
import consoleLogsAtom from "../atoms/consoleLogsAtom";

const {Header, Content, Sider} = Layout;

enum MENU_KEYS {
  INSTANTIATE = "instantiate",
  CONTRACT = "contract",
  RESET = "reset",
}

const DebuggerLayout = () => {
  global.window.Buffer = global.window.Buffer || require("buffer").Buffer;
  const [collapsed, setCollapsed] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const [wasmBuffer, setWasmBuffer] = React.useState<ArrayBuffer | null>(null);
  const [payload, setPayload] = React.useState("");
  const [response, setResponse] = React.useState<JSON | undefined>();
  const [allStates, setAllStates] = React.useState<IState[]>([]);
  const [currentState, setCurrentState] = useState(0);
  const [executeQueryTab, setExecuteQueryTab] = useRecoilState(executeQueryTabAtom);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(snackbarNotificationAtom);
  const [isInstantiated, setIsInstantiated] = React.useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useRecoilState(consoleLogsAtom);
  const {MOCK_ENV, MOCK_INFO} = Config;

  const addState = (stateBefore: any, res: any) => {
    const stateObj: IState = {
      chainStateBefore: stateBefore,
      payload: payload,
      currentTab: executeQueryTab,
      chainStateAfter: window.VM?.backend?.storage.dict["c3RhdGU="],
      res: res,
    };
    setAllStates([...allStates, stateObj]);
    setCurrentState(allStates.length);
  };

  const items = [
    getItem("Contract", MENU_KEYS.CONTRACT, <CheckCircleOutlined/>),
    getItem("Reset", MENU_KEYS.RESET, <ReloadOutlined/>),
  ];

  const onInstantiateClickHandler = () => {
    try {
      const res = window.VM.instantiate(MOCK_ENV, MOCK_INFO, {count: 20});
      addState("", "");
      setIsInstantiated(true);
      setSnackbarNotification({
        ...snackbarNotification,
        severity: 'success',
        open: true,
        message: "CosmWasm VM successfully instantiated!"
      });
      setConsoleLogs([...consoleLogs, res]);
    } catch (err) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: 'error',
        open: true,
        message: "CosmWasm VM was not able to instantiate. Please check console for errors."
      });
      setConsoleLogs([...consoleLogs, err]);
    }
  };
  const onItemSelectHandler = (menuKey: string) => {
    if (menuKey === MENU_KEYS.RESET) {
      setIsFileUploaded(false);
      setWasmBuffer(null);
      setPayload("");
      setAllStates([]);
      setIsInstantiated(false);
    }
  };
  return (
      <Layout
          style={{
            minHeight: "100vh",
          }}
      >
        <SnackbarNotification/>
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo"/>
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
                height: "8vh",
                marginBottom: "10px",
                lineHeight: "0px",
              }}
          >
            <div
                style={{
                  display: "flex",
                  overflowX: "scroll",
                  height: "100%",
                  marginLeft: "10px",
                  alignItems: "center",
                  padding: "10px",
                }}
            >
              <StateTraversal
                  allStates={allStates}
                  currentState={currentState}
                  setCurrentState={setCurrentState}
                  setPayload={setPayload}
                  setResponse={setResponse}
                  setCurrentTab={setExecuteQueryTab}
              />
            </div>
          </Header>
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
              ) : isInstantiated ? (
                  <ExecuteQuery
                      payload={payload}
                      setPayload={setPayload}
                      response={response}
                      setResponse={setResponse}
                      setAllStates={setAllStates}
                      allStates={allStates}
                      setCurrentState={setCurrentState}
                      currentState={currentState}
                  />
              ) : (
                  <Instantiate
                      onInstantiateClickHandler={onInstantiateClickHandler}
                  />
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
            <StateRenderer
                isFileUploaded={isFileUploaded}
                allStates={allStates}
                currentState={currentState}
            />
          </Content>
          <Content
              className="site-layout-background"
              style={{
                margin: "12px 16px",
                padding: 24,
                minHeight: "18vh",
                maxHeight: "24vh",
                background: "rgb(16 15 15)",
                color: "white",
                overflow: "scroll",
              }}
          >
            <ConsoleRenderer logs={consoleLogs}></ConsoleRenderer>
          </Content>
        </Layout>
      </Layout>
  );
};

export default DebuggerLayout;
