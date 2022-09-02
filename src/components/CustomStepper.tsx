import React from "react";
import { Divider, Typography } from "antd";
import { IState } from "./ExecuteQuery";
import { PlayCircleOutlined } from '@ant-design/icons';
interface IProps {
  state: IState;
  index: number;
  currentState: number;
  setCurrentState: (val: number) => void;
  setResponse: (val: JSON | undefined) => void;
  setPayload: (val: string) => void;
  setCurrentTab: (val: string) => void;
}
export const CustomStepper = ({
  state,
  index,
  currentState,
  setCurrentState,
  setResponse,
  setPayload,
  setCurrentTab,
}: IProps) => {
  const onClickHandler = (e: any) => {
    const { currentTab, res, payload } = state;
    console.log('*******', index);
    console.log(currentTab, res, payload);
    setCurrentTab(currentTab);
    setCurrentState(index);
    setResponse(res);
    setPayload(payload);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "80%",
        width: "140px",
      }}
    >
      {index === 0 && (
        <div
          className="ant-steps-item-icon"
          style={{ marginRight: "0px", borderRadius: "100%" }}
        >
          <span className="ant-steps-icon"><PlayCircleOutlined/></span>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: `${index > 0 ? "110px" : "96px"}`,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "15px",
        }}
      >
        <Divider
          style={{ borderTop: "1px solid rgb(0 0 0 / 95%)", margin: "0px" }}
        />
        <p
          style={{ marginTop: "10px", fontSize: "0.8rem" }}
          id="1"
          className={index>0?"execute":""}
          onClick={index>0?onClickHandler:undefined}
        >
          {state.chainStateBefore.length === 0
            ? "Instantiate"
            : Object.keys(JSON.parse(state.payload))[0]}
        </p>
      </div>
      <div
        className="ant-steps-item-icon"
        style={{ marginRight: "0px", borderRadius: "100%" }}
      >
        <span className="ant-steps-icon">{index}</span>
      </div>
    </div>
  );
};
