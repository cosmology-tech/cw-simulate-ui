import React from "react";
import { IState } from "./ExecuteQuery";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Divider, Typography } from "@mui/material";

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
    setCurrentTab(currentTab);
    setCurrentState(index - 1);
    setResponse(res);
    setPayload(payload);
  };
  const highlight = index === currentState || currentState + 1 === index;
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
          style={{
            marginRight: "0px",
            borderRadius: "100%",
            fontSize: "1.2rem",
            border: "1px solid",
            width: "28px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PlayCircleOutlineIcon />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: `${index > 0 ? "110px" : "96px"}`,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "10px",
        }}
      >
        <Divider sx={{ background: "black", height: "1px", width: "100%" }}>
          <p
            style={{ marginTop: "4px", fontSize: "0.8rem" }}
            id="1"
            className={index > 0 ? "execute" : ""}
            onClick={index > 0 ? onClickHandler : undefined}
          >
            {state.chainStateBefore.length === 0
              ? "Instantiate"
              : Object.keys(JSON.parse(state.payload))[0]}
          </p>
        </Divider>
      </div>
      <div
        style={{
          marginRight: "0px",
          borderRadius: "100%",
          background: highlight ? "#ffb8c9" : undefined,
          fontSize: "1.2rem",
          border: "1px solid",
          width: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
        }}
      >
        <Typography style={{ color: "black" }}>{index}</Typography>
      </div>
    </div>
  );
};
