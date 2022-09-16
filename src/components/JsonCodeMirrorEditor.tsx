import React from "react";
import { useRecoilState } from "recoil";
import { payloadState } from "../atoms/payloadState";
import JsonEditor from "./json-editor/JsonEditor";

export const JsonCodeMirrorEditor: React.FC = () => {
  const [payload, setPayload] = useRecoilState(payloadState);
  return (
    <JsonEditor
      content={payload}
      readOnly={false}
      onChange={setPayload} />
  );
};
