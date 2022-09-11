import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Box } from "@mui/material";
import { GREY_6 } from "../configs/variables";
import { useRecoilState } from "recoil";
import { payloadState } from "../atoms/payloadState";

export const JsonCodeMirrorEditor: React.FC = () => {
  const [payload, setPayload] = useRecoilState(payloadState);
  const placeholder = {
    json: "Enter your JSON here",
  };
  return (
    <Box
      sx={{
        width: "100%",
        margin: 2,
        overflow: "scroll",
        padding: 2,
        border: `1px solid ${GREY_6}`,
        maxHeight: "200px",
      }}
    >
      <ReactCodeMirror
        value={payload}
        extensions={[json()]}
        onChange={(val: string) => setPayload(val)}
        placeholder={JSON.stringify(placeholder)}
      />
    </Box>
  );
};
