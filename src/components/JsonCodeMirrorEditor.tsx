import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Grid } from "@mui/material";
import { GREY_6 } from "../configs/variables";

interface IJsonCodeMirrorEditorProps {
  jsonValue: string;
  placeholder?: any;
  setPayload: (val: string) => void;
}

export const JsonCodeMirrorEditor = ({
  jsonValue,
  placeholder,
  setPayload
}: IJsonCodeMirrorEditorProps) => {
  const defaultPlaceholder = placeholder || {
    "json": "Enter your json here"
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
        placeholder={JSON.stringify(defaultPlaceholder, null, 2)}
        style={{border: "none", height: "100%"}}
      />
    </Grid>
  );
};
