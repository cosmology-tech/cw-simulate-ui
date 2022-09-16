import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Grid } from "@mui/material";
import { GREY_6 } from "../configs/variables";
import { useSetRecoilState } from "recoil";
import { payloadState } from "../atoms/payloadState";

interface IJsonCodeMirrorEditorProps {
  jsonValue: string;
}

export const JsonCodeMirrorEditor = ({jsonValue}: IJsonCodeMirrorEditorProps) => {
  const setPayload = useSetRecoilState(payloadState);
  const placeholder = {
    json: "Enter your JSON here",
  };
  return (
    <Grid
      item
      sx={{
        marginTop: 2,
        overflow: "scroll",
        padding: 2,
        border: `1px solid ${GREY_6}`,
        height: "200px",
        width: "100%",
      }}
    >
      <ReactCodeMirror
        value={jsonValue}
        extensions={[json()]}
        onChange={(val: string) => setPayload(val)}
        placeholder={JSON.stringify(placeholder)}
        style={{border: "none", height: "100%"}}
      />
    </Grid>
  );
};
