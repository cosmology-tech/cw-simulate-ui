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
import { VMInstance } from 'cosmwasm-vm';
import {Config} from '../config';
import { BasicBackendApi, BasicKVStorage, BasicQuerier, IBackend } from "cosmwasm-vm/dist/backend";
const { Header, Content, Sider } = Layout;
declare global {
    interface Window { CosmWasmVM: any; }
}


enum MENU_KEYS {
  INSTANTIATE="instantiate",
  CONTRACT = "contract",
  EXECUTE ="execute",
  QUERY="query",
  RESET="reset"
}
function getItem(label: string, key: string, icon: JSX.Element, children?: { key: any; icon: any; children: any; label: any; }[]) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Contract", MENU_KEYS.CONTRACT, <CheckCircleOutlined />, [
    getItem("Instantiate", MENU_KEYS.INSTANTIATE, <PlayCircleOutlined />),
    getItem("Execute", MENU_KEYS.EXECUTE, <DatabaseOutlined />),
    getItem("Query", MENU_KEYS.QUERY, <SwapOutlined />),
  ]),
  getItem("Reset", MENU_KEYS.RESET, <ReloadOutlined />),
];

const DebuggerLayout = () => {
   const backend: IBackend = {
    backend_api: new BasicBackendApi('terra'),
    storage: new BasicKVStorage(),
    querier: new BasicQuerier(),
  };
  const [collapsed, setCollapsed] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const [wasmBuffer, setWasmBuffer] = React.useState<ArrayBuffer | null>(null);
  const onItemSelectHandler = (menuKey:string) =>{
    if(menuKey===MENU_KEYS.INSTANTIATE) {
       const {MOCK_ENV, MOCK_INFO} = Config;
       let res = window.CosmWasmVM.instantiate(MOCK_ENV,MOCK_INFO,{ count: 20 } );
       console.log(res);
    }
    else if(menuKey===MENU_KEYS.QUERY) {

    }
    else if(menuKey===MENU_KEYS.EXECUTE) {

    }
    else if(menuKey ===MENU_KEYS.RESET) {

    }
  }

  React.useEffect(()=>{
    if(wasmBuffer && wasmBuffer.byteLength>1) {
      //@ts-ignore
      VMInstance.CreateInstance(wasmBuffer).then((res)=>{
        //@ts-ignore
        window.CosmWasmVM = new VMInstance(wasmBuffer,backend,res);
      });
       
      //@ts-ignore
      // window.VMInstance = VMInstance;
      // //@ts-ignore
      // window.registration.active.postMessage({name:"COMPILE", data:{wasmBuffer, backend}});
    }
  },[wasmBuffer])
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
          onSelect={(menuItem)=>onItemSelectHandler(menuItem.key)}
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
