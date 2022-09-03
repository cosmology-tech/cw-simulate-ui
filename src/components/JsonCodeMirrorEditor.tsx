import { Card } from "antd";
import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

interface IProps {
  payload: string;
  setPayload: (value: string) => void;
}

export const JsonCodeMirrorEditor: React.FC<IProps> = ({
  payload,
  setPayload,
}) => {
  const placeholder = {
    json: "Enter your JSON here",
  };
  return (
    <Card
      style={{ width: "100%", margin: 10, overflow: "scroll" }}
      bordered
      bodyStyle={{ padding: "10" }}
    >
      <ReactCodeMirror
        value={payload}
        extensions={[json()]}
        onChange={(val: string) => setPayload(val)}
        placeholder={JSON.stringify(placeholder)}
      />
    </Card>
  );
};
