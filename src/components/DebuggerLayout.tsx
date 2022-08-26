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
import {ExecuteQuery, IState} from "./ExecuteQuery";
import {ConsoleRenderer} from "./ConsoleRenderer";
import StateStepper from "./StateStepper";
import {CustomStepper} from "./CustomStepper";
import {StateTraversal} from "./StateTraversal";

const {Header, Footer, Sider, Content} = Layout;
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
  const [currentTab, setCurrentTab] = React.useState<string>("execute");
  const { MOCK_ENV, MOCK_INFO } = Config;

  const addState = (stateBefore: any, res: any) => {
    const stateObj: IState = {
      chainStateBefore: stateBefore,
      payload: payload,
      currentTab: currentTab,
      chainStateAfter: window.VM?.backend?.storage.dict["c3RhdGU="],
      res: res,
    };
    setAllStates([...allStates, stateObj]);
    setCurrentState(allStates.length);
  };

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
        addState('', '');
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
    <Layout className="layout"
      style={{
        minHeight: "calc(100vh)",
      }}
    >
      <Header style={{backgroundColor: '#FC3E02'}}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={new Array(0).fill(null).map((_, index) => {
            const key = index + 1;
            return {
              key,
              label: `nav ${key}`,
            };
          })}
        />
      </Header>
      <Layout>
      <Sider
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
          style={{
            color: "white"
          }}
      >
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
            <Content style={{display: 'flex', overflowX: 'scroll', height: '100px', margin: '20px', padding: '0', marginBottom: "10px", lineHeight:'0px'}}>
              <StateTraversal allStates={allStates} currentState={currentState} setCurrentState={setCurrentState} setPayload={setPayload} setResponse={setResponse} setCurrentTab={setCurrentTab} />
              {/* TODO: Remove the StateStepper completely. */}
              {/* <StateStepper currentState = {currentState} setCurrentState={setCurrentState} allStates={allStates} setPayload={setPayload} setResponse={setResponse} setCurrentTab={setCurrentTab}/> */}
            </Content>

        <Content
            className="site-layout-content"
          style={{
              margin: "16px",
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
                <ExecuteQuery payload={payload} setPayload={setPayload} response={response} setResponse={setResponse} setAllStates={setAllStates} allStates={allStates} setCurrentState={setCurrentState} currentState={currentState} currentTab={currentTab} setCurrentTab={setCurrentTab} />
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
            <StateRenderer isFileUploaded={isFileUploaded} allStates={allStates} currentStateNumber={currentState} />
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
      <Footer style={{backgroundColor: '#1E1E1E'}} className='footer'>
        <h4>©Terran One All Rights Reserved.</h4>
        <div>447 Broadway 2nd Floor Suite #229<br />
          10013 - New York (NY) US</div>
      </Footer>
    </Layout>
  );
};

export default DebuggerLayout;
